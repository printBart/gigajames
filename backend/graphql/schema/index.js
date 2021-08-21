const { buildSchema } = require('graphql');
module.exports = buildSchema(`

type User{
    _id: ID!
    token: String!
    email: String!
    username: String!
    faculty: String
    emoji: String
    points: Float!
    ghostmode: Boolean
}

type Post{
    _id: ID!
    title: String!
    description: String!
    creator: User!
    latitude: Float!
    longitude: Float!
    emoji: String!
    voteValue: Float!
    date: String
    isNightmode: Boolean
}

type Comment{
    _id: ID!
    description: String!
    creator: User
    latitude: Float!
    longitude: Float!
    date: String
    post: Post!
    parentComment: Comment
    childComments: [Comment]!
}

type Vote {
    _id: ID!
    voter: User!
    post: Post!
    value: Int!
    date: String!
}

type Message {
    _id: ID!
    senderToken: User
    receiverToken: User
    message: String
    room: String!
    date: String!
}

type RootQuery{
    getUserByToken(token: String!): User!
    getAllPosts: [Post]!
    getAllCommentsByPostId(postId: String!): [Comment]!
    getChildCommentsByCommentId(commentId: String!): [Comment]!
    getAllRecentComments: [Comment]!
    getAllMessagesByRoom(senderToken: String!, receiverToken: String!): [Message]
    getUserVotedByThread(token: String!, postId: String!): Vote
}

type RootMutation{
    registerUser(token: String!, email: String!, faculty: String, emoji: String!):  User!
    createPost(title: String!, description: String!, creator: String, latitude: Float!, longitude: Float!, emoji: String!, isNightmode: Boolean): Post!
    createComment(description: String!, creator: String!, latitude: Float!, longitude: Float!, postId: String!, parentComment: String): Comment!
    voteThread(voter: String!, thread: String!, value: Int!): Vote!
    createMessage(senderToken: String!, receiverToken: String!, message: String!): Message!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);