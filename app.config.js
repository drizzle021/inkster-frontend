import 'dotenv/config'
export default {
  expo: {
    name: "inkster",
    slug: "inkster",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "inkster",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      googleServicesFile: "./GoogleService-Info.plist",
      bundleIdentifier: "com.anonymous.inkster",
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "This app uses your location to show where you are on the map."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      config: {
        googleMaps: {
            apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      },
      package: "com.anonymous.inkster",
      googleServicesFile: "./google-services.json",
      permissions: ["ACCESS_FINE_LOCATION"]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "@react-native-firebase/app",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#ffffff",
          "image": "./assets/images/splash-icon-dark.png",
          "dark": {
            "image": "./assets/images/splash-icon.png",
            "backgroundColor": "#000000"
          },
          "imageWidth": 200
        }
      ]
    ],
    experiments: {
      "typedRoutes": true
    }
  }
}
