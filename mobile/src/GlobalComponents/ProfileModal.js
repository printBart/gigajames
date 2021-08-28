import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';


import * as firebase from 'firebase';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
    profileView: {
        flex: 0.75,
        justifyContent: "space-between",
        marginHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        //shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,

        elevation: 14,
        //end shadow
    },
    filler: {
        flex: 1,
    },
    header: {
        display: "flex",
        flexDirection: "row",
    },
    profileButton: {
        backgroundColor: "white", 
        alignItems: "center", 
        justifyContent: "center",
        paddingLeft: 2.5,
        paddingBottom: 1,
        width: 50,
        height: 50,
        borderRadius: 50,
        shadowColor: "#000",
          shadowOffset: {
              width: 0,
              height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
    
          elevation: 10,
    },
    characterSelector: {
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        flex: 1,
    },
    emojiBtn: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    schoolSelector:{
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        width: "100%",
    },
    bioContainer: {
        backgroundColor: "#ebf6f8",
        padding: 10,
        borderRadius: 10,
        height: 70,
    },
    modeButton:{
        flex: 1,
        alignItems: "center",
        padding: 15,
        borderRadius: 25,
    },
    ghostModeButton:{
        backgroundColor: "#7367FF",
    },
    logoutBtn: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderRadius: 15,
        backgroundColor: "#f5f5f5",
        paddingLeft: 20,
    },
    editBioBtn: {
        padding: 7.5,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 2.5,

    },
    editBioBtnText: {
        textAlign: "center",
        fontWeight: "bold",
        color: "white"
    }
});

const ProfileModal = (props) => {
    const bioInput = useRef();
    const [ghostMode, setGhostMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [bio, setBio] = useState("This is my bio. Dm me if you want to talk :)");
    const [editBio, setEditBio] = useState(bio);

    const logoutUser = async() => {
        props.setVisible(false)
        try{
          await firebase.auth().signOut();
        } catch(e){
          throw e;
        }
    }

    useEffect(() => {
        if(editMode){
            bioInput.current.focus();
        }
    }, [editMode])

    const saveBio = () => {
        setBio(editBio);
        setEditMode(false);
    }

    const cancelEditBio = () => {
        setEditBio(bio);
        setEditMode(false);
    }

    return (
            <Modal
                transparent={true}
                visible={props.visible ? true : false}
            >
                <SafeAreaView style={{display: 'flex', flex: 1}}>
                    <View style = {styles.profileView}>
                        <View style = {styles.header}>
                            <View style = {styles.characterSelector}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator = {false}>
                                    <TouchableOpacity style = {styles.emojiBtn}>
                                        <Text style ={{fontSize: 30}}>🐵</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {styles.emojiBtn}>
                                        <Text style ={{fontSize: 30}}>🐶</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {styles.emojiBtn}>
                                        <Text style ={{fontSize: 30}}>🦊</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {styles.emojiBtn}>
                                        <Text style ={{fontSize: 30}}>🐺</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.emojiBtn, {paddingLeft: 10, backgroundColor: "#7367FF", borderRadius: 50}]}>
                                        <Text style ={{fontSize: 30}}>🐯</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {styles.emojiBtn}>
                                        <Text style ={{fontSize: 30}}>🦄</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {styles.emojiBtn}>
                                        <Text style ={{fontSize: 30}}>🐮</Text>
                                    </TouchableOpacity>
                                </ScrollView> 
                            </View>
                            <View style = {{justifyContent: "center", alignItems: "center", paddingHorizontal: 5}}>
                                <Text style = {{fontSize: 17, fontWeight: "500", color: "#3C3C3D"}}>🍁 50</Text>
                            </View>
                        </View>
                        <View style = {styles.schoolSelector}>
                            <Text style = {{fontSize: 20}}>🏫 University of British Columbia</Text>
                        </View>
                        {!editMode ? 
                        <TouchableOpacity style = {styles.bioContainer} onPress = {() => setEditMode(true)}>
                            <Text style = {{fontSize: 15,}}>✏️ {bio}</Text> 
                        </TouchableOpacity> :
                        <View>
                            <View  style = {styles.bioContainer}>
                                <View style = {{flexDirection: "row", paddingRight: 5,}}>
                                    <Text style = {{fontSize: 15, paddingRight: 5,}}>✏️</Text>
                                    <TextInput
                                        ref={bioInput}
                                        style={{fontSize: 15, width: "90%"}}
                                        value = {editBio}
                                        placeholder = {"This is my bio..."}
                                        onChangeText={setEditBio}/>
                                </View>
                            </View>
                            <View style = {{flexDirection: "row", marginVertical: 10,}}>
                                <TouchableOpacity style = {[styles.editBioBtn, {backgroundColor: "lightgray"}]} onPress = {cancelEditBio}>
                                    <Text style = {styles.editBioBtnText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style = {[styles.editBioBtn, {backgroundColor: "#7367FF"}]} onPress = {saveBio}>
                                    <Text style = {styles.editBioBtnText}>Edit Bio</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}
                        <View style = {{flexDirection: "row",borderRadius: 25, backgroundColor: "#f5f5f5"}}>
                            <TouchableOpacity style = {!ghostMode ? [styles.modeButton, styles.ghostModeButton] : styles.modeButton} onPress = {() => setGhostMode(false)}>
                                <Text style = {!ghostMode ? {fontSize: 15, fontWeight: "bold", color: "white"} : {fontSize: 15}}>😎 Vibe Mode</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {ghostMode ? [styles.modeButton, styles.ghostModeButton] : styles.modeButton} onPress = {() => setGhostMode(true)}>
                                <Text style = {ghostMode ? {fontSize: 15, fontWeight: "bold", color: "white"} : {fontSize: 15}}>👻 Ghost Mode</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style = {styles.logoutBtn} onPress = {logoutUser}>
                            <Text style = {{ fontSize: 17, fontWeight: "bold", color: "#3C3C3D"}}>Logout</Text>
                            <Icon name = "chevron-right" size = {20}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style = {styles.filler} onPress = {() => props.setVisible(false)}></TouchableOpacity>
                </SafeAreaView>
            </Modal>
    );
}

export default ProfileModal;