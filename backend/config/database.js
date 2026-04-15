const { connectDB: connectMongo, disconnectDB: disconnectMongo } = require("./db")
const { connectSQL, disconnectSQL } = require("./prisma")

const VALID_DB_MODES = ["mongo", "sql", "hybrid"]

const getDatabaseMode = () => {
  const rawMode = process.env.DB_MODE || "sql"
  const mode = rawMode.toLowerCase()

  if (!VALID_DB_MODES.includes(mode)) {
    throw new Error(`Invalid DB_MODE: ${rawMode}. Use one of: ${VALID_DB_MODES.join(", ")}`)
  }

  return mode
}

const connectDatabase = async () => {
  const mode = getDatabaseMode()
  console.log('[DB DEBUG] DB_MODE:', process.env.DB_MODE, '| Selected mode:', mode)

  if (mode === "mongo") {
    await connectMongo()
    return { mode }
  }

  if (mode === "sql") {
    await connectSQL()
    return { mode }
  }

  if (mode === "hybrid") {
    if (!process.env.POSTGRES_URL) {
      throw new Error("POSTGRES_URL is required when DB_MODE is hybrid")
    }
    await connectMongo()
    await connectSQL()
    return { mode }
  }
}

const disconnectDatabase = async () => {
  const mode = getDatabaseMode()

  if (mode === "mongo") {
    await disconnectMongo()
    return
  }

  if (mode === "sql") {
    await disconnectSQL()
    return
  }

  if (mode === "hybrid") {
    await disconnectMongo()
    await disconnectSQL()
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
  getDatabaseMode,
}
