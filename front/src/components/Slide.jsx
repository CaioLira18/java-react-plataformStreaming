import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Slide = () => {

    const API_URL = "http://localhost:8080/api";
    const [series, setSeries] = useState([]);
    const [movies, setMovies] = useState([]);
    const [collection, setCollection] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0); // ✅ Estado para o carrossel
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const scroll = (ref, direction) => {
        if (!ref.current) return;
        const scrollAmount = 300;
        ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
        });
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % collection.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) =>
        prev === 0 ? collection.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        fetch(`${API_URL}/collections`)
          .then((res) => res.json())
          .then((data) => Array.isArray(data) && setCollection(data))
          .catch((err) => console.error("Erro ao buscar coleções", err));
      }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setIsAuthenticated(true);
            setIsAdmin(parsedUser.role === 'ADMIN');
          } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
    }, [navigate]);

  return (

    <div>
      {/* CARROSSEL MANUAL */}
      <div className="container-slider">
  <div className="container-images">
    {collection.map((item, index) => (
      <div key={index} className="slide-container">
        <img
          src={item.backgroundFranquia}
          alt={`slide-${index}`}
          className={`slider ${index === currentSlide ? 'on' : ''}`}
          style={{ display: index === currentSlide ? 'block' : 'none' }}
        />
        <div className={`franquiaInformations ${index === currentSlide ? 'on' : ''}`}>
          <img src={item.logoFranquia} alt="Logo da franquia" />
          <p>{item.descricaoFranquia}</p>
          <a href={`/franquia/${item.id}`}><button>Ver Franquia</button></a>
        </div>
      </div>
    ))}
  </div>
</div>
    </div>
  )
}

export default Slide
