import React, {useState} from 'react';
import {
    StyleSheet,
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';

import { postRequest } from '../GlobalFunctions/request';
import { createCommentQuery } from '../GlobalFunctions/queries';
import * as firebase from "firebase";

const styles = StyleSheet.create({
  commentModal: {
    backgroundColor: "white",
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    //shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    
    elevation: 24,
    //end shadow
  },
  header: {
    padding: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 10,
  },
  cancelBtn: {
    fontSize: 20,
    fontWeight: '500',
    opacity: 0.5,
  },
  postBtn: {
    backgroundColor: "#7367FF",
    color: "white",
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  postBtnText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

const CommentModal = (props) => {
  const [comment, setComment] = useState("");

  const postComment = () => {
    const commentId = props.displayComment._id !== props.post._id ? props.displayComment._id : null;
    const token = firebase.auth().currentUser.uid;

    var request = postRequest(
      createCommentQuery(comment, token, props.currentLocation.coords.latitude, props.currentLocation.coords.longitude, props.post._id, commentId),
        "/graphql"
    );
    fetch(request).then((response) => {
        response.json().then((data) => {
          props.setDisplayComment(false);
          //props.commentThread(data.data.createComment); //live data
          setComment('');
          if(commentId){
            props.getCommentsByPostId();
          }
          else{
            data.data.createComment.layer = 0;
            props.setComments(oldComments => [...oldComments, data.data.createComment]);
          }
        })
    });
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.displayComment ? true : false}
    >
      <TouchableOpacity style = {{flex: 2}} onPress={() => props.setDisplayComment(null)}>
      </TouchableOpacity>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style = {styles.commentModal}>
        <View style = {styles.header}>
          <Text>🐸</Text>
        </View>
        <TextInput
          style = {{fontSize: 15,padding: 10, flex: 1}}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => setComment(text)}
          value={comment}
          placeholder = "Add a comment..."
          autoFocus = {true}/>
          <View style ={styles.footer}>
            <TouchableOpacity
                onPress={() => props.setDisplayComment(null)}>
                <Text style = {styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.postBtn} onPress={postComment}>
                <Text style = {styles.postBtnText}>Comment</Text>
            </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default CommentModal;