import React from "react";
import { StyleSheet,
         View, 
         Text, 
         TextInput,
         TouchableOpacity,
         Dimensions } from "react-native";
import { Font } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
import { PropTypes } from 'prop-types';

const {height, width} = Dimensions.get("window");

export default class ToDo extends React.Component{
    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        unCompleteToDo: PropTypes.func.isRequired,
        completeToDo: PropTypes.func.isRequired,
        updateToDo: PropTypes.func.isRequired
    }
    constructor(props){
        super(props);
        this.state = {
            isEditing: false,
            toDoValue: props.text,
            fontLoaded: false
        }
    }
    componentWillMount(){
        this._fontLoading();
      }    
    render(){
        const {isEditing, toDoValue, fontLoaded} = this.state;
        const { text, id, deleteToDo, isCompleted } = this.props;
        return(
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._toggleCompleteToDo}>
                        <View style={[styles.circle, isCompleted ? styles.completedCircle : styles.unCompletedCircle]}/>
                    </TouchableOpacity>
                    {isEditing ? (
                        <TextInput
                           style={[styles.input, 
                                   fontLoaded ? styles.NanumRegular : "",
                                   isCompleted ? styles.completedText : styles.unCompletedText]}
                           value={toDoValue} 
                           onChangeText={this._controlInput}
                           multiline={true}
                           returnKeyType={"done"}
                           onBlur={this._finishEditing}
                           autoCorrect={false}></TextInput>
                    ) : (
                        <Text 
                        style={[styles.text, 
                                fontLoaded ? styles.NanumRegular : "",
                                isCompleted ? styles.completedText : styles.unCompletedText]}>
                        {text}
                        </Text>
                    )}

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
                            <TouchableOpacity onPressOut={(event) => {
                                event.stopPropagation();
                                deleteToDo(id);
                            }}>
                                <View style={styles.actionContainer}>
                                    <MaterialIcons name={"close"} size={20} color={"red"}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                
            </View>
        );
    }
    _toggleCompleteToDo = (event) => {
        event.stopPropagation();
        const {isCompleted, unCompleteToDo, completeToDo, id} = this.props;
        if(!isCompleted){
            completeToDo(id);
        }else{
            unCompleteToDo(id);
        }
    }
    _startEditing = (event) => {
        event.stopPropagation();
        const {text} = this.props;
        this.setState({
            isEditing: true,
            toDoValue: text
        })
    }
    _finishEditing = (event) => {
        event.stopPropagation();
        const { toDoValue } = this.state;
        const { id, updateToDo } = this.props;
        updateToDo(id, toDoValue);
        this.setState({
            isEditing: false
        })
    }
    _controlInput = text => {
        this.setState({
            toDoValue: text
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
    },
    input: {
        width: width / 2,
        fontSize: 20,
        marginVertical: 11
    }
});