import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableHighlight, //배경 하이라이트
  TouchableWithoutFeedback, //ui 변동사항 없음
  Pressable, //위에꺼랑 비슷하지만 길게 누르기 기능이 새로 있음
  // hitSlope 어디까지 누를 것인가 설정
} from "react-native";
import { theme } from "./colors";

export default function App() {
  const [working, setWorking] = useState(true);
  const [saveText, setSaveText] = useState("");
  const handleTravel = () => {
    setWorking(false);
  };
  const handleWork = () => {
    setWorking(true);
  };
  const onChangeTextEvent = (payload) => {
    setSaveText(payload);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleWork}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTravel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onChangeText={onChangeTextEvent}
          value={saveText}
          placeholder={
            working ? "Add to do" : "What do you want to do on a travel?"
          }
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    //padding가로로 주기
    paddingHorizontal: 30,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "space-between",
  },
  btnText: {
    fontSize: 35,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 20,
    fontSize: 18,
  },
});
