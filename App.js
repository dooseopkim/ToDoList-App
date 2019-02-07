import React from 'react';
import { 
        StyleSheet, 
        Text, 
        View, 
        StatusBar, 
        TextInput, 
        ScrollView, 
        Dimensions,
        AsyncStorage
      } from 'react-native';
import { Font, AppLoading } from 'expo';
import ToDo from './ToDo';
import uuidv1 from 'uuid/v1';

const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loadedToDos: false,
      newToDo: "",
      toDos: {},
      fontLoaded: false
    }
  }
  componentWillMount(){
    this._loadToDos();
    this._fontLoading();
  }
  render() {
    const { loadedToDos, newToDo, toDos, fontLoaded } = this.state;
    if(!loadedToDos){
      return <AppLoading/>;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"light-content"}/>
        <Text style={[styles.title, fontLoaded ? styles.NanumBold : ""]}>해야 할 일</Text>
        <View style={styles.card}>
          <TextInput 
            style={[styles.input, fontLoaded ? styles.NanumRegular : ""]}
            placeholder={"새 할일을 추가하세요.."}
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
            />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos)
            .reverse()
            .sort((a, b) => a.createdAt > b.createdAt)
            .map(toDo => (
              <ToDo 
                key={toDo.id}
                deleteToDo={this._deleteToDo}
                unCompleteToDo = {this._unCompleteToDo}
                completeToDo = {this._completeToDo}
                updateToDo = {this._updateToDo}
                id={toDo.id}
                text={toDo.text}
                isCompleted={toDo.isCompleted}
                />
              ))
            }
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    });
  };
  _addToDo = () => {
    const{ newToDo } = this.state;
    if(newToDo !== ""){
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID] : {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        this._saveToDos(newState.toDos);
        return { ...newState };
      });    
    }
  };
  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    })
  };
  _unCompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };
  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });    
  };
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });     
  }
  _loadToDos = async () => {
    try{
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        loadedToDos: true,
        toDos: parsedToDos || {}
      });
    }catch(err){
      console.log(err);
    }
  }
  _saveToDos = (newToDos) => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
    
  }
  _fontLoading = async() => {
    await Font.loadAsync({
      "Nanum": require("./assets/fonts/NanumGothic-Regular.ttf"),
      "NanumBold": require("./assets/fonts/NanumGothic-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    })
  }  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    backgroundColor: "#2B272A"
  },
  NanumRegular: {
    fontFamily: "Nanum"
  },
  NanumBold: {
    fontFamily: "NanumBold"
  },
  title: {
    marginTop: 60,
    fontSize: 35,
    color: "#ffffff"
  },
  card: {
    flex: 1,
    marginTop: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: width - 25,
    backgroundColor: "#ffffff"
  },
  input: {
    padding: 10,
    borderBottomColor: "#C18E35",
    borderBottomWidth: 1,
    fontSize: 20
  },
  toDos: {
    alignItems: "center"
  }
});
