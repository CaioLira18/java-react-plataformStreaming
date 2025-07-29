import React, { useState, useEffect } from 'react';

const Home = () => {
  const API_URL = "http://localhost:8080/api";
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/movie`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMovie(data);
        } else {
          console.error('Formato inesperado para Movies:', data);
        }
      })
      .catch(error => console.error('Erro ao buscar Movies:', error));
  }, []);

  return (
    <div>
      {movie.map((movie, i) => (
        <div className="containerContent" key={i}>
          <div className="boxContent">
            <p>{movie.category}</p>
            <h1>{movie.name}</h1>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
