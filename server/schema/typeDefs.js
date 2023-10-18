const typeDefs = `
type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
}

type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
  }

type Query {
    users: [users]
}

type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(username: String, email: String, password: String!): Auth
    addBook(userId: ID!, book: BookInput): User
    removeBook(userId: ID!, bookId: ID!): User
    }
`;
