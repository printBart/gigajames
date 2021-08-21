import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import EmojiSelectorModal from './EmojiSelectorModal';

const styles = StyleSheet.create({
    emojiSelector: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        opacity: 1,
        padding: 10,
        borderRadius: 25,
        marginBottom: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
    },
    emoji: {
        fontSize: 30
    }
});

const EmojiSelector = (props) => {
    const [displayFullEmojiModal, setDisplayFullEmojiModal] = useState(false); 
    return (
        <View style = {styles.emojiSelector}>
            <TouchableOpacity onPress = {() => props.setCurrentEmoji("😀")}>
                <Text style = {styles.emoji}>😀</Text>
            </TouchableOpacity >
            <TouchableOpacity onPress = {() => props.setCurrentEmoji("😄")}>
                <Text style = {styles.emoji}>😄</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => props.setCurrentEmoji("😣")}>
                <Text style = {styles.emoji}>😣</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => props.setCurrentEmoji("😚")}>
                <Text style = {styles.emoji}>😚</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => props.setCurrentEmoji("😝")}>
                <Text style = {styles.emoji}>😝</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => props.setCurrentEmoji("🥳")}>
                <Text style = {styles.emoji}>🥳</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => props.setCurrentEmoji("🤝")}>
                <Text style = {styles.emoji}>🤝</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {{backgroundColor: "#f5f5f5", width: 35, height: 35, borderRadius: 50, justifyContent: "center", alignItems: "center", marginRight: 5,}}
                onPress = {() => setDisplayFullEmojiModal(true)}>
                <FeatherIcon name = "plus" size = {25} color = "gray"/>
            </TouchableOpacity>
            <EmojiSelectorModal
                displayModal = {displayFullEmojiModal}
                setModal = {setDisplayFullEmojiModal}/>
        </View>
    );
}

export default EmojiSelector;