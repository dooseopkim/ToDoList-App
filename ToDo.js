import React from "react";
import { StyleSheet,
         View, 
         Text, 
         TouchableOpacity,
         Dimensions } from "react-native";
import { Font } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';

const {height, width} = Dimensions.get("window");

export default class ToDo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fontLoaded: false,
            isEditing: false,
            isCompleted: false
        }
    }
    componentWillMount(){
        this._fontLoading();
      }    
    render(){
        const {fontLoaded, isEditing, isCompleted} = this.state;
        return(
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._toggleCompleteToDo}>
                        <View style={[styles.circle, isCompleted ? styles.completedCircle : styles.unCompletedCircle]}/>
                    </TouchableOpacity>
                    <Text 
                        style={[styles.text, 
                                fontLoaded ? styles.NanumRegular : "",
                                isCompleted ? styles.completedText : styles.unCompletedText]}>
                        Hello I'm ToDo
                    </Text>
                </View>
                    {isEditing ? (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._finishEditing}>
                                <View style={styles.actionContainer}>
                                    <MaterialIcons name={"check"} size={20} color={"#3AE732"}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ):(
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._startEditing}>
                                <View style={styles.actionContainer}>
                                    <MaterialIcons name={"create"} size={20} color={"#26181A"}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.actionContainer}>
                                    <MaterialIcons name={"close"} size={20} color={"red"}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                
            </View>
        );
    }
    _toggleCompleteToDo = () => {
        this.setState(prevState => {
            return({
                isCompleted: !prevState.isCompleted
            });
        });
    }
    _startEditing = () => {
        this.setState({
            isEditing: true
        })
    }
    _finishEditing = () => {
        this.setState({
            isEditing: false
        })
    }
    _fontLoading = async() => {
        await Font.loadAsync({
          "Nanum": require("./assets/fonts/NanumGothic-Regular.ttf")
        });
        this.setState({
          fontLoaded: true
        })
      }    
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: "#E7BC5C",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    NanumRegular: {
      fontFamily: "Nanum"
    },
    column: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: width/2
    },
    actions: {
        flexDirection: "row"
    },
    actionContainer: {
        marginVertical: 5,
        marginHorizontal: 5
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderColor: "red",
        borderWidth: 3,
        backgroundColor: "white",
        marginRight: 20
    },
    completedCircle: {
        borderColor: "#bbb"
    },
    unCompletedCircle: {
        borderColor: "red"
    },
    completedText: {
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    unCompletedText: {
        color: "#353535"
    },
    text: {
        fontSize: 20,
        marginVertical: 15
    }
});