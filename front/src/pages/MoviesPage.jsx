import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const API_URL = "http://localhost:8080/api";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

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
          <div className="boxContentPage" key={i}>
            <div className="boxInformationPage">
              <img src={movie.image} alt={movie.name} />
              <a href={"/movies/" + movie.id}><p>{movie.name}</p></a>
            </div>
          </div>
        ))}
      </div>

      {/* 
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
      */}
    </div>
  )
}

export default MoviesPage;