export function registerUserQuery(token, email, faculty, emoji){
    return {
        query:
        `mutation{
            registerUser(token: "${token}", email: "${email}", faculty: "${faculty}", emoji: "${emoji}"){
              _id
            }
        }`
    }
}
export function getAllPostsQuery(){
    return{
        query:
        `query{
            getAllPosts{
                _id
                title
                description
                creator{
                    _id
                    username
                    emoji
                }
                latitude
                longitude
                emoji
                date
                voteValue
                isNightmode
            }
        }`
    }
}

export function getAllCommentsByPostIdQuery(postId){
    return{
        query:
        `query{
            getAllCommentsByPostId(postId: "${postId}"){
                _id
                description
                creator{
                    _id
                    username
                    emoji
                }
                latitude
                longitude
                date
                post{
                    _id
                }
                childComments{
                    _id
                    description
                    creator{
                        _id
                        username
                    }
                    latitude
                    longitude
                    date
                    post{
                        _id
                    }
                    childComments{
                        _id
                        description
                        creator{
                            _id
                            username
                        }
                        latitude
                        longitude
                        date
                        post{
                            _id
                        }
                        childComments{
                            _id
                        }
                    }
                }
            }
        }`
    }
}

export function getChildCommentsByCommentId(commentId){
    return{
        query:
        `query{
            getChildCommentsByCommentId(commentId: "${commentId}"){
                _id
                description
                creator{
                    _id
                    username
                }
                latitude
                longitude
                date
                post{
                    _id
                }
                childComments{
                    _id
                    description
                    creator{
                        _id
                        username
                    }
                    latitude
                    longitude
                    date
                    post{
                        _id
                    }
                    childComments{
                        _id
                        description
                        creator{
                            _id
                            username
                        }
                        latitude
                        longitude
                        date
                        post{
                            _id
                        }
                        childComments{
                            _id
                        }
                    }
                }
            }
        }`
    }
}

export function createPostQuery(title, description, creator, latitude, longitude, emoji){
    return{
        query:
        `mutation{
            createPost(title: "${title}", description:"${description}", creator: "${creator}", latitude: ${latitude}, longitude: ${longitude}, emoji: "${emoji}"){
                _id
                title
                description
                creator{
                    _id
                }
                latitude
                longitude
                date
            }
        }`
    }
}

export function createCommentQuery(description, creator, latitude, longitude, postId, parentCommentId){
    parentCommentId ? parentCommentId = '"' + parentCommentId + '"' : parentCommentId = null;
    return{
        query:
        `mutation{
            createComment(description: "${description}", creator: "${creator}", latitude: ${latitude}, longitude: ${longitude}, postId: "${postId}", parentComment: ${parentCommentId}){
                _id
                description
                creator{
                    _id
                    username
                }
                latitude
                longitude
                date
                post{
                    _id
                    title
                    description
                }
                parentComment{
                    _id
                }
                childComments{
                    _id
                }
            }
        }`
    }
}

export function voteThreadQuery(voter, thread, value){
    return{
        query:
        `mutation{
            voteThread(voter: "${voter}", thread: "${thread}", value: ${value}){
            _id
            }
        }`
    }
}

export function getAllMessagesByRoom(senderToken, receiverToken){
    return{
        query:
        `query{
            getAllMessagesByRoom(senderToken: "${senderToken}", receiverToken: "${receiverToken}"){
              _id
              senderToken{
                _id
                token
                emoji
              }
              receiverToken{
                _id
                token
                emoji
              }
              message
              room
              date
            }
        }`
    }
}

export function getUserVotedByThread(token, postId){
    return{
        query:
        `query{
            getUserVotedByThread(token: "${token}", postId: "${postId}"){
                _id
                value
                date
            }
        }`
    }
}