import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather';

//functions
import { postRequest } from '../../GlobalFunctions/request';
import { getAllPostsQuery } from '../../GlobalFunctions/queries';

//components
import ThreadPreview from './Components/ThreadPreview';
import ThreadModal from '../../GlobalComponents/ThreadModal';

const styles = StyleSheet.create({
  threadView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  header: {
    fontSize: 35,
    textAlign: 'center',
    color: "grey",
  },
  filterMenu: {
    flexDirection: "row",
    paddingVertical: 15,
    justifyContent: "center",
  },
  filterBtn: {
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 10,
    borderRadius: 10,
  },
  filterBtnText: {
    fontSize: 15,
    color: "#6A6A6A"
  },
  threadContainer: {
    alignSelf: 'stretch',
  }
});

const ThreadView = (props) => {
  const [selectedThread, setSelectedThread] = useState(null);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = () => {
    console.log("retrieving all posts");
    var request = postRequest(
      getAllPostsQuery(),
       "/graphql"
   );
   fetch(request).then((response) => {
      response.json().then((data) => {
        setAllPosts(data.data.getAllPosts);
      });
   });
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.displayAllThreads ? true : false}
    >
      <TouchableOpacity style = {{height: "12.5%"}} onPress={() => props.setDisplayAllThreads(false)}>
        </TouchableOpacity>
    <SafeAreaView style = {styles.threadView}>
      <View style = {{paddingHorizontal: 10, display: "flex", flexDirection: "row", alignItems: "center", paddingVertical: 20,}}>
        <TouchableOpacity  onPress={() => props.setDisplayAllThreads(false)}>
          <FeatherIcon name = "chevron-down" size = {35}/>
        </TouchableOpacity>
        <View style = {{flex: 1}}></View>
        <TouchableOpacity style = {{marginRight: 5}} onPress = {props.toggleCreateThread}>
          <FeatherIcon name = "edit" size = {27}/>
        </TouchableOpacity>
      </View>
      <ScrollView style = {styles.threadContainer}>
        <View style = {styles.filterMenu}>
          <TouchableOpacity style = {styles.filterBtn}>
            <Text style = {styles.filterBtnText}>Hot</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.filterBtn}>
            <Text style = {styles.filterBtnText}>New</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.filterBtn}>
            <Text style = {styles.filterBtnText}>Top</Text>
          </TouchableOpacity>
        </View>
        {allPosts.map((post) => {
          return(
            <ThreadPreview
              key = {post._id}
              post = {post}
              setSelectedThread = {setSelectedThread}/>
          )
        })}
      </ScrollView>
      
      {selectedThread &&
        <ThreadModal
          currentLocation = {props.currentLocation}
          selectedThread = {selectedThread}
          setSelectedThread = {setSelectedThread}/>}


    </SafeAreaView>
    </Modal>
  );
};

export default ThreadView;