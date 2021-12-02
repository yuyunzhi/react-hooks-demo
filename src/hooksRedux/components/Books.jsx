import React from "react";
import useAsync from '../hooks/useAsync'

function Books() {
  const {state} = useAsync('/books', (response) => {
    return {type: "setBooks", books: response}
  })

  return (
      <div>
        <h1>我的书籍</h1>
        <ol>
          {state.books
              ? state.books.map(book => <li key={book.id}>{book.name}</li>)
              : "加载中"}
        </ol>
      </div>
  );
}

export default Books
