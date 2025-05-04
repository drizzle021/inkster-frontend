import { View } from "react-native";
import { Link } from "expo-router"
import { useTheme } from './contexts/ThemeContext';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/home"> start</Link>

    </View>
  );
}
