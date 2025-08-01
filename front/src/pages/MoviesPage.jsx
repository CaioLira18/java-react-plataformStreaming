import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const MoviesPage = () => {
  const [movie, setMovie] = useState([]);
  const API_URL = "http://localhost:8080/api";
  const [isAuthenticated, setIsAuthenticated] = useState(false);



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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        setName(parsedUser.name);

        console.log("Dados do usuário carregados:", parsedUser);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    } else {
      console.log("Nenhum usuário encontrado no localStorage");
    }

  }, []);

  const navigate = useNavigate();

  {
    !isAuthenticated && (
      navigate('/login')
    )
  }

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
