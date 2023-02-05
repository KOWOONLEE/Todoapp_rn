import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { EvilIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  Button,
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
  const [modified, setModified] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [image, setImage] = useState(null);

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
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      //string을 object로 만들어줌
      setToDos(JSON.parse(s));
    } catch {
      console.log("에러가 발생했습니다.");
    }
  };

  useEffect(() => {
    loadToDos();
  }, []);

  const addToDo = async () => {
    if (saveText.length === 0) {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { saveText, working, modified },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setSaveText("");
  };

  // const pickImage = async () => {
  //   //권한 요청
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.canceled) {
  //     setImage(result.assets[0].uri);
  //   }
  // };

  const deleteToDo = (key) => {
    Alert.alert("Delete to do?", "Are you sure?", [
      {
        text: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
    return;
  };

  const modifiedToDo = async (key) => {
    const newToDos = { ...toDos };
    newToDos[key] = { modified: true };
    console.log(modified);
    setToDos(newToDos);
    await saveToDos(newToDos);
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
              <BouncyCheckbox
                size={20}
                // text={toDos[key].saveText}
                iconStyle={{ borderRadius: 0 }}
                fillColor="pink"
                innerIconStyle={{
                  borderRadius: 0,
                }}
                isChecked={isChecked}
                textStyle={{
                  color: isChecked ? theme.grey : "white",
                  marginLeft: 30,
                }}
                // onPress={(isChecked) => {
                //   !isChecked;
                // }}
              />
              <Text style={styles.toDoText}>{toDos[key].saveText}</Text>
              {/* <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button title="이미지 첨부하기" onPress={pickImage} />
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 200, height: 200 }}
                  />
                )}
              </View> */}
              <TouchableOpacity
                onPress={() => {
                  modifiedToDo(key);
                }}
              >
                <Text>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  deleteToDo(key);
                }}
              >
                <EvilIcons name="trash" size={24} color="white" />
              </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.toDoBg,
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  toDoTextL: {
    color: theme.grey,
    fontSize: 15,
    textDecorationLine: "line-through",
  },
  toDoText: {
    color: "white",
    fontSize: 15,
  },
  colorgrey: {
    color: theme.grey,
  },
  colorwhite: {
    color: "white",
  },
});
