import React from 'react';
import { 
        StyleSheet, 
        Text, 
        View, 
        StatusBar, 
        TextInput, 
        ScrollView, 
        Dimensions,
        Platform 
      } from 'react-native';
import { Font } from 'expo';

const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      fontLoaded: false,
      newToDo: ""
    }
  }
  componentWillMount(){
    this._fontLoading();
  }
  render() {
    const { fontLoaded, newToDo } = this.state;
    const fontRegular = fontLoaded ? styles.fontRegular : null;
    const fontBold = fontLoaded ? styles.fontBold : null;
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"light-content"}/>
        <Text style={[styles.title, fontBold]}>해야 할 일</Text>
        <View style={styles.card}>
          <TextInput 
            style={[styles.newToDo, fontRegular]}
            placeholder={"새 할일을 추가하세요.."}
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            />
          <ScrollView style={styles.toDos}></ScrollView>
        </View>
      </View>
    );
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
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    backgroundColor: "#2B272A"
  },
  fontRegular: {
    fontFamily: "Nanum"
  },
  fontBold: {
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
  newToDo: {
    padding: 10,
    borderBottomColor: "#C18E35",
    borderBottomWidth: 1,
    fontSize: 20
  }
});
