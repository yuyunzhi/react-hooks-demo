import React from "react";
import useAsync from '../hooks/useAsync'

function Movies() {
  const {state} = useAsync('/movies', (response) => {
    return {type: "setMovies", movies: response}
  })
  return (
      <div>
        <h1>我的电影</h1>
        <ol>
          {state.movies
              ? state.movies.map(movie => <li key={movie.id}>{movie.name}</li>)
              : "加载中"}
        </ol>
      </div>
  );
}

export default Movies

