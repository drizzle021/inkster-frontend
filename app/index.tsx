import { Text, TextInput, View } from "react-native";
import { Link } from "expo-router"

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/auth/login"> start</Link>

    </View>
  );
}
