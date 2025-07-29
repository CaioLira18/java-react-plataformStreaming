import React, { useState, useEffect } from 'react';

const Home = () => {
  const API_URL = "http://localhost:8080/api";
  const [series, setSeries] = useState([]);
  const [movies, setMovies] = useState([]);


  useEffect(() => {
    fetch(`${API_URL}/series`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSeries(data);
        } else {
          console.error('Formato inesperado para Movies:', data);
        }
      })
      .catch(error => console.error('Erro ao buscar Movies:', error));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/movie`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          console.error('Formato inesperado para Movies:', data);
        }
      })
      .catch(error => console.error('Erro ao buscar Movies:', error));
  }, []);

  return (
    <div>
      <div className="genericContentBox">
        <h1>Series</h1>
        <p>Mostrar Tudo</p>
        <div className="containerContent" >
          {series.map((series, i) => (
            <div className="boxContent" key={i}>
              {series.type = "SERIES" && (
                <div className="boxInformation">
                  <img src={series.image} alt="" />
                  <a href={"/series/" + series.id}><p>{series.name}</p></a>
                </div>
              )}
            </div>

          ))}
          <div className="rowAngle">
            <i class="fa-solid fa-angle-right"></i>
          </div>
        </div>

      </div>

      <div className="genericContentBox">
        <h1>Filmes</h1>
        <p>Mostrar Tudo</p>
        <div className="containerContent" >
          {movies.map((movies, i) => (
            <div className="boxContent" key={i}>
              {movies.type = "MOVIES" && (
                <div className="boxInformation">
                  <img src={movies.image} alt="" />
                  <p>{movies.name}</p>
                </div>
              )}
            </div>
          ))}
          <div className="rowAngle">
            <i class="fa-solid fa-angle-right"></i>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
