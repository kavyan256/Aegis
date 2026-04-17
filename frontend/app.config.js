const os = require("os")

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces()

  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address
      }
    }
  }

  return "localhost"
}

const apiHost = process.env.API_HOST || getLocalIPAddress()
const apiPort = Number(process.env.API_PORT || process.env.PORT || 3000)

module.exports = {
  expo: {
    name: "Aegis ID",
    slug: "aegis-id",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      PORT: apiPort,
      API_HOST: apiHost,
    },
    plugins: ["expo-barcode-scanner", "expo-font"],
  },
}

