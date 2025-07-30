import {useState, useEffect} from 'react'

const MoviesPage = () => {
    const [movie, setMovie] = useState([]);
    const API_URL = "http://localhost:8080/api";


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
      <div className="containerContent" >
          {movie.map((movie, i) => (
            <div className="boxContent" key={i}>
              {movie.type = "SERIES" && (
                <div className="boxInformation">
                  <img src={movie.image} alt="" />
                  <a href={"/movies/" + movie.id}><p>{movie.name}</p></a>
                </div>
              )}
            </div>

          ))}
    </div>
    </div>
  )
}

export default MoviesPage
