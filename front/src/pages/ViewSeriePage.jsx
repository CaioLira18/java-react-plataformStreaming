import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const ViewSeriePage = () => {
  const [series, setSeries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_URL = "http://localhost:8080/api";
  // const API_URL = "https://java-react-plataformstreaming.onrender.com/api";
  const navigate = useNavigate();
  {
    !isAuthenticated && (
      navigate('/login')
    )
  }

  const fetchSeries = (page) => {
    fetch(`${API_URL}/series?page=${page}&size=20`)
      .then(response => response.json())
      .then(data => {
        setSeries(data.content || []);
        setIsLast(data.last);
        setCurrentPage(data.number);
      })
      .catch(error => console.error('Erro ao buscar Séries:', error));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsAuthenticated(true);
      fetchSeries(0);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="pageContainer">
      <div className="containerContentPage">
        {series.map((item, i) => (
          <div className="boxContent" key={i}>
            <div className="boxInformation">
              <a href={"/AdicionarEpisodio/" + item.id}>
                <img src={item.imageVertical} alt={item.name} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="paginationControls">
        <button 
          disabled={currentPage === 0} 
          onClick={() => fetchSeries(currentPage - 1)}
        >
          Anterior
        </button>
        <span>Página {currentPage + 1}</span>
        <button 
          disabled={isLast} 
          onClick={() => fetchSeries(currentPage + 1)}
        >
          Próxima
        </button>
      </div>
      <div className="space"></div>
    </div>
  )
}

export default ViewSeriePage;