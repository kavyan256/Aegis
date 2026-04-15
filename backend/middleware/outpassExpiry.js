const { getPrismaClient } = require("../config/prisma")

const prisma = getPrismaClient()

// Middleware to automatically check and expire old outpasses
const checkOutpassExpiry = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const startOfToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
    
    // Update expired outpasses in the background
    const expiredOutpasses = await prisma.outpass.updateMany(
      {
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
      {
        data: {
          status: "expired"
        }
      }
    );

    // Log if any outpasses were expired (optional, can be commented out in production)
    if (expiredOutpasses.modifiedCount > 0) {
      console.log(`Auto-expired ${expiredOutpasses.modifiedCount} outpasses at ${currentDate}`);
    }

    next();
  } catch (error) {
    console.error("Error in outpass expiry middleware:", error);
    // Don't fail the request if expiry check fails, just log and continue
    next();
  }
};

module.exports = { checkOutpassExpiry };
