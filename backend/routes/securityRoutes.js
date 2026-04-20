const express = require("express")
const { getPrismaClient } = require("../config/prisma")
const { authenticate } = require("../middleware/auth")
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

const buildPasskeyResponse = (passkey) => ({
  id: passkey.id,
  hash: passkey.hash,
  createdAt: passkey.createdAt,
  expiresAt: passkey.expiresAt,
  isActive: !passkey.isUsed && passkey.expiresAt > new Date(),
})

router.post("/validate", authenticate, async (req, res) => {
  try {
    const { hash, location } = req.body

    if (!hash) {
      return res.status(400).json({ message: "Passkey hash is required" })
    }

    const passkey = await prisma.passkey.findFirst({
      where: {
        hash,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: userSelect,
        },
      },
    })

    if (!passkey) {
      return res.status(400).json({ message: "Invalid or expired passkey" })
    }

    await prisma.passkey.update({
      where: { id: passkey.id },
      data: {
        isUsed: true,
      },
    })

    await prisma.log.create({
      data: {
        id: generateId(),
        userId: passkey.userId,
        action: "scan_attempt",
        location: location || null,
        success: true,
        details: {
          message: `Passkey validated at ${location || "unknown location"}`,
        },
        scanType: "manual",
      },
    })

    res.json({
      message: "Passkey validated successfully",
      student: {
        name: passkey.user.name,
        studentId: passkey.user.studentId,
        hostel: passkey.user.hostel,
        roomNumber: passkey.user.roomNumber,
      },
      passkey: buildPasskeyResponse(passkey),
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("Passkey validation error:", error)
    res.status(500).json({ message: "Server error validating passkey" })
  }
})

router.post("/log", authenticate, async (req, res) => {
  try {
    let { action, location, guardId, guardName, userId, studentId, hash } = req.body
    const allowedActions = new Set(["entry", "exit"])

    let scannedUser = null

    if (userId) {
      scannedUser = await prisma.user.findUnique({
        where: { id: String(userId) },
        select: {
          id: true,
          name: true,
          studentId: true,
          role: true,
          hostel: true,
          roomNumber: true,
        },
      })
    }

    if (!scannedUser && studentId) {
      scannedUser = await prisma.user.findFirst({
        where: { studentId: String(studentId) },
        select: {
          id: true,
          name: true,
          studentId: true,
          role: true,
          hostel: true,
          roomNumber: true,
        },
      })
    }

    if (!scannedUser && hash) {
      const passkey = await prisma.passkey.findFirst({
        where: {
          hash: String(hash),
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              studentId: true,
              role: true,
              hostel: true,
              roomNumber: true,
            },
          },
        },
      })

      scannedUser = passkey?.user || null
    }

    if (!scannedUser) {
      return res.status(400).json({
        message: "Invalid QR data. Unable to identify scanned student.",
      })
    }

    const previousLog = await prisma.log.findFirst({
      where: {
        userId: scannedUser.id,
        action: {
          in: ["entry", "exit"],
        },
      },
      orderBy: { createdAt: "desc" },
    })

    if (!action || !allowedActions.has(action)) {
      action = previousLog?.action === "entry" ? "exit" : "entry"
    }

    const log = await prisma.log.create({
      data: {
        id: generateId(),
        userId: scannedUser.id,
        action,
        location: location || null,
        guardId: req.user.guardId || guardId || null,
        guardName: req.user.name || guardName || null,
        success: true,
        details: {
          message: "Security log created successfully",
          scannedUserId: scannedUser.id,
          scannedStudentId: scannedUser.studentId || null,
          scannedUserName: scannedUser.name,
          scannedByUserId: req.user.userId,
        },
        scanType: "manual",
      },
    })

    res.status(200).json({
      message: "Security log created successfully",
      log,
      user: scannedUser,
    })
  } catch (error) {
    console.error("Security log error:", error)
    res.status(500).json({ message: "Server error creating security log" })
  }
})

router.get("/logs", authenticate, async (req, res) => {
  try {
    const { location } = req.query

    const logs = await prisma.log.findMany({
      where: {
        ...(location && location.trim().length > 0
          ? {
              location: {
                contains: location.trim(),
                mode: "insensitive",
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            studentId: true,
            role: true,
            hostel: true,
            roomNumber: true,
          },
        },
      },
    })

    res.status(200).json({ logs })
  } catch (error) {
    console.error("Fetch security logs error:", error)
    res.status(500).json({ message: "Server error fetching security logs" })
  }
})

module.exports = router
