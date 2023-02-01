import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight, //배경 하이라이트
  TouchableWithoutFeedback, //ui 변동사항 없음
  Pressable, //위에꺼랑 비슷하지만 길게 누르기 기능이 새로 있음
  // hitSlope 어디까지 누를 것인가 설정
} from "react-native";
import { theme } from "./colors";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [saveText, setSaveText] = useState("");
  const [toDos, setToDos] = useState({});
  const handleTravel = () => {
    setWorking(false);
  };
  const handleWork = () => {
    setWorking(true);
  };
  const onChangeTextEvent = (payload) => {
    setSaveText(payload);
  };

  const saveToDos = async (toSave) => {
    // value는 string밖에 안돼서 바꿔주는 작업
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    //string을 object로 만들어줌
    setToDos(JSON.parse(s));
  };

  useEffect(() => {
    loadToDos();
  }, []);

  const addToDo = async () => {
    if (saveText.length === 0) {
      return;
    }
    // const newToDos = Object.assign({}, toDos, {
    //   [Date.now()]: { saveText, working },
    // });
    //3개의 object를 결합하기 위해 Object.assign 사용
    //먼저 비어있는 object 결합,다음 이전 todo를 새로운 todo와 합침
    const newToDos = { ...toDos, [Date.now()]: { saveText, working } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setSaveText("");
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
          onSubmitEditing={addToDo}
          returnKeyLabel="done"
          placeholder={
            working ? "Add to do" : "What do you want to do on a travel?"
          }
          style={styles.input}
        />
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].saveText}</Text>
            </View>
          ) : null
        )}
      </ScrollView>
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
    marginVertical: 20,
    borderRadius: 20,
    fontSize: 16,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  toDoText: {
    color: "white",
    fontSize: 15,
  },
});
