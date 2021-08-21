import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';
import { socket } from '../../../GlobalFunctions/socket';

//functions
import { convertDeltaMilisToTime } from '../../../GlobalFunctions/date';
import { postRequest } from '../../../GlobalFunctions/request';
import { getUserVotedByThread } from '../../../GlobalFunctions/queries';


const styles = StyleSheet.create({
    threadPreview: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        //shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        //shadow
        margin: 10,
    },
    voteContainer: {
        alignItems: "center"
    },
    threadBodyContainer: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 25,
    },
    threadTitle: {
        fontWeight: "600",
        fontSize: 20,
    },
    threadDescription: {
        paddingVertical: 15,
        fontSize: 15,
        overflow: "hidden",
    },
    footer:{
        flexDirection: "row",
        justifyContent: "space-between",
    },
    footerLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    footerRight: {
        fontSize: 15, color: "gray", fontWeight: "600"
    }
});


const ThreadPreview = (props) => {
    const [voteSelected, setVoteSelected] = useState(0);

    useEffect(() => {
        getVoteStatus();
        socket.on('getVotePost', (vote) => {
            setVoteSelected(vote.value);
        });
    }, []);

    const votePost = (value) => {
        const token = firebase.auth().currentUser.uid;
        socket.emit('votePost', {
          voter: token,
          thread: props.post._id,
          value,
        })
    }

    const getVoteStatus = () => {
        const token = firebase.auth().currentUser.uid;
        var request = postRequest(
            getUserVotedByThread(token, props.post._id),
            "/graphql"
            );
            fetch(request).then((response) => {
                response.json().then((data) => {
                    if(data.data.getUserVotedByThread){
                        setVoteSelected(data.data.getUserVotedByThread.value);
                    }
                })
            }
        )
    }

    return (
        <TouchableOpacity style = {styles.threadPreview} onPress =  {() => props.setSelectedThread(props.post)}>
            <View style = {styles.voteContainer}>
                <TouchableOpacity onPress = {() => votePost(1)}>
                    <FeatherIcon name="chevron-up" size={35} color = {voteSelected >=1 ? "black" : "lightgray"}/>
                </TouchableOpacity>
                <Text>{props.post.voteValue + voteSelected}</Text>
                <TouchableOpacity onPress = {() => votePost(-1)}>
                    <FeatherIcon name="chevron-down" size={35} color = {voteSelected <= -1 ? "black" : "lightgray"}/>
                </TouchableOpacity>
            </View>
            <View style = {styles.threadBodyContainer}>
                <View>
                    <Text style = {styles.threadTitle}>{props.post?.emoji} {props.post?.title}</Text>
                </View>
                <Text style = {styles.threadDescription}>{props.post.description}</Text>
                <View style = {styles.footer}>
                    <View style = {styles.footerLeft}>
                        <MaterialCommunityIcons name = "comment" size = {15} color = "gray"/>
                        <Text style ={styles.footerRight}>&nbsp;Comments</Text>
                    </View>
                    <Text style = {styles.footerRight}>{props.post?.creator?.emoji} {convertDeltaMilisToTime(Number(props.post?.date))} ago</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default ThreadPreview;