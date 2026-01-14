import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const API_URL = "http://localhost:8080/api";
  // const API_URL = "https://java-react-plataformstreaming.onrender.com/api";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  {
    !isAuthenticated && (
      navigate('/login')
    )
  }

  const fetchMovies = (page) => {
    fetch(`${API_URL}/movie?page=${page}&size=20`)
      .then(response => response.json())
      .then(data => {
        setMovies(data.content || []);
        setIsLast(data.last);
        setCurrentPage(data.number);
      })
      .catch(error => console.error('Erro ao buscar Movies:', error));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsAuthenticated(true);
      fetchMovies(0);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="pageContainer">
      <div className="containerContentPage">
        {movies.map((movie, i) => (
          <div className="boxContent" key={i}>
            <div className="boxInformation">
              <a href={"/movies/" + movie.id}>
                <img src={movie.imageVertical} alt={movie.name} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="paginationControls">
        <button 
          disabled={currentPage === 0} 
          onClick={() => fetchMovies(currentPage - 1)}
        >
          Anterior
        </button>
        <span>Página {currentPage + 1}</span>
        <button 
          disabled={isLast} 
          onClick={() => fetchMovies(currentPage + 1)}
        >
          Próxima
        </button>
      </div>
      <div className="space"></div>
    </div>
  )
}

export default MoviesPage;