import React from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

import { DELETE_BOOK } from "../utils/mutations";
import { removeBookId } from "../utils/localStorage";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_ME } from "../utils/queries";

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  console.log(data);
  const [deleteBook, { error }] = useMutation(DELETE_BOOK);

  const userData = data?.me || {};
  console.log(userData);

  // create function that accepts the book_id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook({
        variables: { bookId },
        refetchQueries: [{ query: GET_ME }],
      });
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Container fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Container>
      <Container>
        <h2 key={userData.savedBooks.length}>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
