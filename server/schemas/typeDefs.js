const { gql } = require("apollo-server-express");
const { constraintDirectiveTypeDefs } = require("graphql-constraint-directive");

const typeDefs = gql`
  ${constraintDirectiveTypeDefs}
  type User {
    _id: ID
    username: String
    #...  email: String! @constraint(format: "email")
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    outhors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  input BookInput {
    bookId: String!
    authors: [String]
    title: String!
    description: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;
module.exports = typeDefs;
