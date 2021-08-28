import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import MapboxGL from "@react-native-mapbox-gl/maps";
import { socket } from '../../GlobalFunctions/socket';

import token from '../../../token.json';
import Icon from 'react-native-vector-icons/Feather';
import * as firebase from 'firebase';

//components
import CreateThreadModal from '../../GlobalComponents/CreateThreadModal';
import ThreadPreview from './Components/ThreadPreview';
import ThreadModal from '../../GlobalComponents/ThreadModal';
import ThreadView from '../ThreadView/ThreadView';
import ProfileModal from '../../GlobalComponents/ProfileModal';
import BottomModalPreview from './Components/BottomModalPreview';
import MessageModal from '../MessageView/MessageView';
import UserProfilePreview from './Components/UserProfilePreview';
import PrivateMessageView from '../MessageView/Components/PrivateMessageView';


MapboxGL.setAccessToken(token.token);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'stretch',
  },
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: 'green',
  },
  map: {
    flex: 1,
  },
  postModal: {
    backgroundColor: "white",
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 20,
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
  body: {
    flex: 1,
  },
  titleContainer:{
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingRight: 35,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  description: {
    flex: 1,
    padding: 20,
    fontSize: 20,
  },
  postBubble: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  profileButton: {
    backgroundColor: "white", 
    display: "flex", 
    flex: 1,
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
  sendButton: {
    backgroundColor: "white",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    paddingRight: 2.5,
    paddingTop: 2.5,
  }
});

const MapView = ({navigation}) => {
  const [currentUser, updateCurrentUser] = useState();
  const [currentUsers, updateCurrentUsers] = useState([]);
  const [currentUserProfile, updateCurrentUserProfile] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [displayThread, setDisplayThread] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [livePosts, setLivePosts] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [displayAllThreads, setDisplayAllThreads] = useState(null);
  const [privateMessage, setPrivateMessage] = useState(null);


  useEffect(() => {
    socket.on('displayLivePosts', (livePosts) => {
      setLivePosts(livePosts);
    });

    // socket.on('message', (message) => {
    //   console.log(message);
    // });

    socket.on('displayCurrentUsers', (onlineUsers) => {
      const token = firebase.auth().currentUser.uid;
      updateCurrentUsers(onlineUsers);
      const myUser = onlineUsers.filter((user) => {
        return user.token === token
      });
      updateCurrentUser(myUser[0]);
    })
    emitThread();
    Geolocation.getCurrentPosition((position) => {
      setCurrentLocation(position);
      sendUserLocation(position.coords.longitude, position.coords.latitude)
    });
    Geolocation.watchPosition(
      (position) => {
        setCurrentLocation(position);
        sendUserLocation(position.coords.longitude, position.coords.latitude)
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},)
  }, []);

  const emitThread = (thread) => {
    setDisplayThread(false);
    socket.emit('postThread', thread);
  }

  const sendUserLocation = (longitude, latitude) => {
    const token = firebase.auth().currentUser.uid;
    socket.emit('sendUserLocation', {
      userToken: token,
      longitude,
      latitude
    });
  }

  const joinDMRoom = (receiverToken) => {
    setPrivateMessage(receiverToken);
    updateCurrentUserProfile(null);
    const token = firebase.auth().currentUser.uid;
    socket.emit('joinDMRoom', {
      senderToken: token,
      receiverToken,
    })
  }

  const toggleCreateThreadFromList = () => {
    setDisplayAllThreads(false);
    setDisplayThread(true);
  }

  console.log("onlineUsers");
  console.log(currentUsers);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          styleURL = {'mapbox://styles/mapbox/outdoors-v10?optimize=true'}
          pitchEnabled = {false}
          rotateEnabled = {false}>
            <MapboxGL.Camera
              zoomLevel = {13}
              maxZoomLevel = {16}
              animationMode ={'flyTo'}
              animationDuration = {1000}
              followUserLocation = {true}>
            </MapboxGL.Camera>
            {livePosts.map((post) => {
                return(
                  <MapboxGL.PointAnnotation
                    key = {post._id}
                    id = {post._id}
                    tracksViewChanges={false}
                    coordinate={[post.latitude, post.longitude]}
                    anchor = {{x: 0.5, y: 2}}
                    >
                      <ThreadPreview
                        post = {post}
                        setSelectedThread = {setSelectedThread}/>
                  </MapboxGL.PointAnnotation>
                )
              })}
              {currentUserProfile &&
                <MapboxGL.PointAnnotation
                    key = {"currentUserProfile"}
                    id = {"currentUserProfile"}
                    tracksViewChanges={false}
                    coordinate={[currentUserProfile.longitude, currentUserProfile.latitude]}
                    anchor = {{x: 0.45, y: 1.7}}
                    >
                      <UserProfilePreview
                        currentUserProfile = {currentUserProfile}
                        joinDMRoom = {joinDMRoom}/>
                  </MapboxGL.PointAnnotation>
              }
              {[...new Map(currentUsers.map(o => [o._id, o])).values()].map((currentUser, index) => {
                return(
                  <MapboxGL.PointAnnotation
                    key={currentUser._id}
                    id={currentUser._id}
                    tracksViewChanges={false}
                    coordinate={[currentUser.longitude, currentUser.latitude]}>
                    <TouchableOpacity style = {{alignItems: "center"}} onPress = {() => updateCurrentUserProfile(prevState => prevState?._id == currentUser._id ? null : currentUser)}>
                      <Text style = {{fontSize: 30}}>{currentUser.emoji ? currentUser.emoji : "🐶"}</Text>
                    </TouchableOpacity>
                  </MapboxGL.PointAnnotation>
                )
              })}
          </MapboxGL.MapView>
      </View>
      <CreateThreadModal
        displayThread = {displayThread}
        currentLocation = {currentLocation}
        setDisplayThread = {setDisplayThread}
        emitThread = {emitThread}/>
      {displayAllThreads &&
        <ThreadView
          currentLocation = {currentLocation}
          displayAllThreads = {displayAllThreads}
          setDisplayAllThreads = {setDisplayAllThreads}
          toggleCreateThread = {toggleCreateThreadFromList}/>}

      {selectedThread &&
      <ThreadModal
        currentLocation = {currentLocation}
        selectedThread = {selectedThread}
        setSelectedThread = {setSelectedThread}/>}
      <SafeAreaView  style = {{position: "absolute", top: 50, left: 10}}>
        <TouchableOpacity style ={styles.profileButton} onPress = {() => setProfileVisible(true)}>
          <Text style ={{fontSize: 30}}>{currentUser && currentUser.emoji}</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView  style = {{position: "absolute", top: 50, right: 10}}>
        <TouchableOpacity style ={styles.sendButton} onPress = {() => setMessageVisible(true)}>
          <Icon name = "send" size={27}/>
        </TouchableOpacity>
      </SafeAreaView>

      <ProfileModal
        visible = {profileVisible}
        setVisible = {setProfileVisible}/>
      <MessageModal
        visible = {messageVisible}
        setVisible = {setMessageVisible}/>
        {socket && privateMessage &&
          <PrivateMessageView
            visible = {privateMessage}
            setVisible = {setPrivateMessage}
            socket = {socket}/>}
      <BottomModalPreview
        setDisplayThread = {setDisplayThread}
        setDisplayAllThreads = {setDisplayAllThreads}/>
    </View>
  );
}

export default MapView;