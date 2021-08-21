//graphql database functions
const graphqlResolver = require('./graphql/resolver/index');
var onlineUsers = [];

function socketioConnection(server) {
    const io = require('socket.io')(server, {cors: {origin: '*'}, reconnection:false});
    io.on("connection", (socket)=>{
        console.log("User Conntected", socket.id);

        //user joins direct message
        socket.on('joinDMRoom', ({ senderToken, receiverToken }) => {
            const room = senderToken < receiverToken ? (senderToken + receiverToken) : (receiverToken + senderToken);
            socket.join(room);
            //io.in(room).emit('message', {senderToken, message : senderToken + " has joined!"});
        });

        //user sends message in direct message room
        socket.on('sendMessage', ({senderToken, receiverToken, message}) => {
            const room = senderToken < receiverToken ? senderToken + receiverToken : receiverToken + senderToken;
            graphqlResolver.createMessage({senderToken, receiverToken, message}).then((message) => {
                io.in(room).emit('message',  message); 
            });
        })

        //user leaves direct message room
        socket.on('leaveDMRoom', ({senderToken, receiverToken}) => {
            const room = senderToken < receiverToken ? senderToken + receiverToken : receiverToken + senderToken;
            socket.leave(room);
            //io.in(room).emit('message', {senderToken, message : senderToken + " has Left!"});
        });

        //user commenct thread on post
        socket.on("commentThread", (commentData) => {
            io.emit('displayCreatedComment', commentData); 
        });

        //user post a thread
        socket.on("postThread", (thread) => {
            graphqlResolver.getAllRecentPosts().then((posts) => {
                io.emit("displayLivePosts", posts);
            })
        })

        //sends current user location
        socket.on("sendUserLocation", (userLocationData) => {
            var userMovedIndex = onlineUsers.findIndex(user => user.token === userLocationData.userToken);
            
            if(userMovedIndex>-1){
                onlineUsers[userMovedIndex].longitude = userLocationData.longitude;
                onlineUsers[userMovedIndex].latitude = userLocationData.latitude;
                io.emit("displayCurrentUsers", onlineUsers);
            }
            else{
                graphqlResolver.getUserByToken({token: userLocationData.userToken}).then((user) => {
                    const userData = {
                        ...user._doc,
                        longitude: userLocationData.longitude,
                        latitude: userLocationData.latitude
                    }
                    onlineUsers.push(userData);
                    io.emit("displayCurrentUsers", onlineUsers);
                });
            };
        });

        socket.on("votePost", ({voter, thread, value}) => {
            graphqlResolver.voteThread({voter, thread, value}).then((vote) => {
                io.emit("getVotePost", vote);
            })
        })

        socket.on('disconnect', () => {
            console.log("disconnected user");
        });
    });
}

module.exports = { socketioConnection };