import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import PieChartComponent from "../components/PieChartComponent";

export default function Index() {

  const router = useRouter()

  

  return (
    <View style={styles.container}>
      <PieChartComponent/>
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
 
});

