import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import PieChartComponent from "../components/PieChartComponent";

export default function Index() {
  const { appEnv } = Constants.expoConfig?.extra ?? {};
  const router = useRouter()



  return (
    <View style={styles.container}>
      <Text style={styles.envText}>Environment: {appEnv}</Text>
      <PieChartComponent />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff'
  },
  envText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  }
});
