import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Slide = () => {
    const API_URL = "https://java-react-plataformstreaming.onrender.com/api";
    // const API_URL = "http://localhost:8080/api";
    const [collection, setCollection] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [previousSlide, setPreviousSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    // Estado para pausar o auto-play e ativar o vídeo
    const [isPaused, setIsPaused] = useState(false);
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

    const goToSlide = (index) => {
        changeSlide(index);
    };

    // Carregar coleções
    useEffect(() => {
        fetch(`${API_URL}/collections`)
            .then((res) => res.json())
            .then((data) => Array.isArray(data) && setCollection(data))
            .catch((err) => console.error("Erro ao buscar coleções", err));
    }, []);

    // Lógica de Auto-play com pausa
    useEffect(() => {
        if (collection.length > 1 && !isPaused) {
            const interval = setInterval(() => {
                if (!isTransitioning) {
                    nextSlide();
                }
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [collection.length, currentSlide, isTransitioning, isPaused]);

    if (collection.length === 0) {
        return (
            <div className="loading">
                <div className="loadingText">
                    <p>Carregando Conteúdo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='slide'>
            <div className="container-slider">
                <div 
                    className="container-images"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {collection.map((item, index) => (
                        <div
                            key={index}
                            className={`slide-container ${index === currentSlide ? 'active' :
                                index === previousSlide && isTransitioning ? 'previous' : 'hidden'
                                }`}
                        >
                            {/* Imagem de Fundo */}
                            <img
                                src={item.backgroundFranquia}
                                alt={`slide-${index}`}
                                className={`slider ${index === currentSlide ? 'on' : ''}`}
                                loading={Math.abs(index - currentSlide) <= 1 ? 'eager' : 'lazy'}
                            />

                            {/* Vídeo: Aparece apenas no slide ativo e quando o mouse está sobre ele */}
                            {index === currentSlide && item.videoFranquia && (
                                <video 
                                    src={item.videoFranquia}
                                    autoPlay 
                                    muted 
                                    loop 
                                    className={`video-franquia ${isPaused ? 'visible' : ''}`}
                                />
                            )}

                            <div className="image-overlay"></div>
                            
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