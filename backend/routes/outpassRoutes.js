const express = require("express")
const { getPrismaClient } = require("../config/prisma")
const { authenticate } = require("../middleware/auth")
const { checkOutpassExpiry } = require("../middleware/outpassExpiry")
const { generateId } = require("../utils/hashGenerator")

const prisma = getPrismaClient()
const router = express.Router()

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  studentId: true,
  hostel: true,
  roomNumber: true,
  phoneNumber: true,
  emergencyContact: true,
}

const buildOutpassResponse = (outpass) => ({
  ...outpass,
  user: outpass.user
    ? {
        id: outpass.user.id,
        name: outpass.user.name,
        studentId: outpass.user.studentId,
        hostel: outpass.user.hostel,
        roomNumber: outpass.user.roomNumber,
      }
    : undefined,
})

const getTodayRange = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return { today, tomorrow }
}

async function expireOldOutpasses() {
  try {
    const currentDate = new Date()
    const startOfToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

    const expiredOutpasses = await prisma.outpass.updateMany({
      where: {
        status: {
          in: ["pending", "approved"],
        },
        OR: [
          {
            expectedReturnDate: {
              lt: currentDate,
            },
          },
          {
            outDate: {
              lt: startOfToday,
            },
          },
        ],
      },
      data: {
        status: "expired",
      },
    })

    console.log(`Expired ${expiredOutpasses.count} old outpasses`)
    return expiredOutpasses.count
  } catch (error) {
    console.error("Error expiring old outpasses:", error)
    return 0
  }
}

router.post("/generate", authenticate, async (req, res) => {
  try {
    const { purpose, destination, fromTime, toTime, emergencyName, emergencyContact } = req.body

    if (!purpose || !destination || !fromTime || !toTime) {
      return res.status(400).json({
        message: "Please provide all required fields: purpose, destination, fromTime, toTime",
      })
    }

    const exitDate = new Date(fromTime)
    const returnDate = new Date(toTime)
    const currentDate = new Date()
    const { today, tomorrow } = getTodayRange()

    const exitDateOnly = new Date(exitDate)
    exitDateOnly.setHours(0, 0, 0, 0)

    if (exitDateOnly.getTime() !== today.getTime()) {
      return res.status(400).json({
        message: "Outpass can only be generated for the current day",
      })
    }

    const returnDateOnly = new Date(returnDate)
    returnDateOnly.setHours(0, 0, 0, 0)

    if (returnDateOnly.getTime() !== today.getTime()) {
      return res.status(400).json({
        message: "Return time must be on the same day as exit time",
      })
    }

    if (returnDate <= exitDate) {
      return res.status(400).json({
        message: "Expected return time must be after exit time",
      })
    }

    const existingOutpass = await prisma.outpass.findFirst({
      where: {
        userId: req.user.userId,
        outDate: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ["pending", "approved"],
        },
      },
    })

    if (existingOutpass) {
      return res.status(400).json({
        message: "You already have an active outpass for today",
      })
    }

    await expireOldOutpasses()

    const outpass = await prisma.$transaction(async (tx) => {
      const createdOutpass = await tx.outpass.create({
        data: {
          id: generateId(),
          userId: req.user.userId,
          reason: purpose.trim(),
          destination: destination.trim(),
          outDate: exitDate,
          expectedReturnDate: returnDate,
          emergencyContactName: emergencyName || null,
          emergencyContactPhone: emergencyContact || null,
          status: "approved",
          approvedById: req.user.userId,
        },
        include: {
          user: {
            select: userSelect,
          },
        },
      })

      await tx.outpassAuditTrail.create({
        data: {
          id: generateId(),
          outpassId: createdOutpass.id,
          status: "approved",
          changedBy: req.user.userId,
          changedAt: currentDate,
          remarks: "Same-day outpass auto-generated and approved",
        },
      })

      await tx.log.create({
        data: {
          id: generateId(),
          userId: req.user.userId,
          action: "outpass_generated",
          success: true,
          details: {
            message: `Same-day outpass generated for ${purpose} to ${destination}`,
          },
          scanType: "manual",
        },
      })

      return createdOutpass
    })

    res.status(201).json({
      message: "Outpass generated successfully for today",
      outpass: buildOutpassResponse(outpass),
      validity: {
        validFrom: exitDate,
        validUntil: returnDate,
        expiresAt: new Date(tomorrow.getTime() - 1),
      },
    })
  } catch (error) {
    console.error("Outpass generation error:", error)
    res.status(500).json({ message: "Server error generating outpass" })
  }
})

router.get("/history", [authenticate, checkOutpassExpiry], async (req, res) => {
  try {
    const { status, limit } = req.query
    const parsedLimit = Math.min(Number.parseInt(limit, 10) || 25, 100)

    const query = {
      userId: req.user.userId,
    }

    if (status && typeof status === "string" && status.trim().length > 0) {
      query.status = status.trim().toLowerCase()
    }

    await expireOldOutpasses()

    const outpasses = await prisma.outpass.findMany({
      where: query,
      orderBy: { createdAt: "desc" },
      take: parsedLimit,
      include: {
        user: {
          select: userSelect,
        },
      },
    })

    res.json({ outpasses: outpasses.map(buildOutpassResponse) })
  } catch (error) {
    console.error("Outpass history fetch error:", error)
    res.status(500).json({ message: "Server error fetching outpass history" })
  }
})

router.get("/today", [authenticate, checkOutpassExpiry], async (req, res) => {
  try {
    const { today, tomorrow } = getTodayRange()

    const outpass = await prisma.outpass.findFirst({
      where: {
        userId: req.user.userId,
        outDate: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        user: {
          select: userSelect,
        },
      },
    })

    if (!outpass) {
      return res.json({
        message: "No outpass found for today",
        outpass: null,
      })
    }

    const currentTime = new Date()
    let currentOutpass = outpass

    if (outpass.expectedReturnDate < currentTime && outpass.status === "approved") {
      currentOutpass = await prisma.$transaction(async (tx) => {
        const updatedOutpass = await tx.outpass.update({
          where: { id: outpass.id },
          data: {
            status: "expired",
          },
          include: {
            user: {
              select: userSelect,
            },
          },
        })

        await tx.outpassAuditTrail.create({
          data: {
            id: generateId(),
            outpassId: outpass.id,
            status: "expired",
            changedBy: null,
            changedAt: currentTime,
            remarks: "Auto-expired due to return time passed",
          },
        })

        return updatedOutpass
      })
    }

    res.json({
      outpass: buildOutpassResponse(currentOutpass),
      isActive: currentOutpass.status === "approved" && currentOutpass.expectedReturnDate > currentTime,
      timeRemaining:
        currentOutpass.status === "approved"
          ? Math.max(0, currentOutpass.expectedReturnDate.getTime() - currentTime.getTime())
          : 0,
    })
  } catch (error) {
    console.error("Today's outpass fetch error:", error)
    res.status(500).json({ message: "Server error fetching today's outpass" })
  }
})

module.exports = router
