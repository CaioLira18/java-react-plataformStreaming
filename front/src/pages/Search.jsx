import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [movie, setMovie] = useState([]);
  const [serie, setSerie] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = "https://java-react-plataformstreaming-8f2k.onrender.com/api";
  // const API_URL = "http://localhost:8080/api";


  const navigate = useNavigate();
  {
    !isAuthenticated && (
      navigate('/login')
    )
  }

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
      // LOGICA PAGEABLE: Acessando .content e aumentando size para buscar tudo na pesquisa
      fetch(`${API_URL}/movie?size=1000`)
        .then(res => res.json())
        .then(data => {
          const content = data.content || data; // Se for paginado usa .content, senão usa data
          Array.isArray(content) ? setMovie(content) : console.error('Formato inesperado para Movies:', data)
        })
        .catch(err => console.error('Erro ao buscar Movies:', err));

      fetch(`${API_URL}/series?size=1000`)
        .then(res => res.json())
        .then(data => {
          const content = data.content || data;
          Array.isArray(content) ? setSerie(content) : console.error('Formato inesperado para Series:', data)
        })
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
          <div className="boxContent" key={i}>
            <div className="boxInformation">
              <a href={`/${item.type === "MOVIE" ? "movies" : "series"}/${item.id}`}>
                <img src={item.imageVertical} alt={item.name} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;