import gql from "graphql-tag";

export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      bookCount
      SavedBooks {
        bookId
        description
        image
        link
        title
      }
    }
  }
`;
