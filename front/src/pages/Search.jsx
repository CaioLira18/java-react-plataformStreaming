import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [movie, setMovie] = useState([]);
  const [serie, setSerie] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = "http://localhost:8080/api";

  const navigate = useNavigate();

  // Check authentication first
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        setName(parsedUser.name);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Navigate only after authentication check is complete
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch data only when authenticated
  useEffect(() => {
    if (isAuthenticated === true) {
      fetch(`${API_URL}/movie`)
        .then(res => res.json())
        .then(data => Array.isArray(data) ? setMovie(data) : console.error('Formato inesperado para Movies:', data))
        .catch(err => console.error('Erro ao buscar Movies:', err));

      fetch(`${API_URL}/series`)
        .then(res => res.json())
        .then(data => Array.isArray(data) ? setSerie(data) : console.error('Formato inesperado para Series:', data))
        .catch(err => console.error('Erro ao buscar Series:', err));
    }
  }, [isAuthenticated]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return <div>Carregando...</div>;
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const allItems = [...movie, ...serie];

  function handleSearch(e) {
    setSearchTerm(e.target.value);
  }

  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="searchInput">
        <div className="boxSearchInput">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            value={searchTerm}
            onChange={handleSearch}
            placeholder='Pesquise algum filme ou série'
            type="text"
          />
        </div>
      </div>

      <div className="containerContentPage">
        {filteredItems.map((item, i) => (
          <div className="boxContentPage" key={i}>
            <div className="boxInformationPage">
              <img src={item.image} alt={item.name} />
              <a href={`/${item.type === "MOVIE" ? "movies" : "series"}/${item.id}`}>
                <p>{item.name}</p>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;