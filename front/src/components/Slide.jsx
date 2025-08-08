import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Slide = () => {
    const API_URL = "http://localhost:8080/api";
    const [collection, setCollection] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

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

    // Auto-play opcional
    useEffect(() => {
        if (collection.length > 1) {
            const interval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
            return () => clearInterval(interval);
        }
    }, [collection.length]);

    if (collection.length === 0) {
        return <div>Carregando...</div>;
    }

    const currentItem = collection[currentSlide];

    return (
        <div>
            {/* CARROSSEL */}
            <div className="container-slider">
                <div className="container-images">
                    {/* Apenas o slide atual é renderizado */}
                    <div className="slide-container">
                        <img
                            src={currentItem.backgroundFranquia}
                            alt={`slide-${currentSlide}`}
                            className="slider on"
                        />
                        <div className="franquiaInformations on">
                            <img src={currentItem.logoFranquia} alt="Logo da franquia" />
                            <p>{currentItem.descricaoFranquia}</p>
                            <button onClick={() => navigate(`/franquia/${currentItem.id}`)}>
                                Ver Franquia
                            </button>
                        </div>
                    </div>

                    {/* Indicadores de slides */}
                    <div className="slide-indicators">
                        {collection.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Slide;
