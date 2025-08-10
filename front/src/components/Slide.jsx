import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Slide = () => {
    const API_URL = "https://java-react-plataformstreaming.onrender.com/api" || "http://localhost:8080/api";
    const [collection, setCollection] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [previousSlide, setPreviousSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const changeSlide = (newIndex) => {
        if (isTransitioning || newIndex === currentSlide) return;
        setIsTransitioning(true);
        setPreviousSlide(currentSlide);

        setTimeout(() => {
            setCurrentSlide(newIndex);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 100);
        }, 50);
    };

    const nextSlide = () => {
        const newIndex = (currentSlide + 1) % collection.length;
        changeSlide(newIndex);
    };

    const prevSlide = () => {
        const newIndex = currentSlide === 0 ? collection.length - 1 : currentSlide - 1;
        changeSlide(newIndex);
    };

    const goToSlide = (index) => {
        changeSlide(index);
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

    useEffect(() => {
        if (collection.length > 1) {
            const interval = setInterval(() => {
                if (!isTransitioning) {
                    nextSlide();
                }
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [collection.length, currentSlide, isTransitioning]);

    if (collection.length === 0) {
        return (
            <div className="loading">
                <div className="loadingText">
                    <p>Carregando Conteudo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='slide'>
            <div className="container-slider">
                <div className="container-images">
                    {collection.map((item, index) => (
                        <div
                            key={index}
                            className={`slide-container ${index === currentSlide ? 'active' :
                                index === previousSlide && isTransitioning ? 'previous' : 'hidden'
                                }`}
                        >
                            <img
                                src={item.backgroundFranquia}
                                alt={`slide-${index}`}
                                className={`slider ${index === currentSlide ? 'on' : ''}`}
                                loading={Math.abs(index - currentSlide) <= 1 ? 'eager' : 'lazy'}
                            />

                            <div className="image-overlay"></div> {/* <-- camada entre imagem e texto */}
                            <div className={`franquiaInformations ${index === currentSlide ? 'on' : ''}`}>
                                <img
                                    src={item.logoFranquia}
                                    alt="Logo da franquia"
                                    loading="eager"
                                />
                                <p>{item.descricaoFranquia}</p>
                                <button onClick={() => navigate(`/franquia/${item.id}`)}>
                                    Ver Franquia
                                </button>
                            </div>
                        </div>
                    ))}



                    <div className="slide-indicators">
                        {collection.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                disabled={isTransitioning}
                                aria-label={`Ir para slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Slide;
