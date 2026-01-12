import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const FranquiaPage = () => {
const { id } = useParams();
const navigate = useNavigate();
// const API_URL = "https://java-react-plataformstreaming.onrender.com/api";
const API_URL = "http://localhost:8080/api";

    const [series, setSeries] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);

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
        if (!isAuthenticated) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const collectionResponse = await fetch(`${API_URL}/collections/${id}`);
                if (collectionResponse.ok) {
                    const collectionData = await collectionResponse.json();
                    setCollection(collectionData);
                } else {
                    console.error('Collection não encontrada');
                }

                // Adicionado ?size=1000 e .content para lidar com Pageable
                const seriesResponse = await fetch(`${API_URL}/series?size=1000`);
                if (seriesResponse.ok) {
                    const seriesData = await seriesResponse.json();
                    // Verifica se os dados vêm dentro de .content (Pageable) ou se é Array direto
                    const finalSeries = seriesData.content || seriesData;
                    if (Array.isArray(finalSeries)) {
                        setSeries(finalSeries);
                    }
                }

                // Adicionado ?size=1000 e .content para lidar com Pageable
                const moviesResponse = await fetch(`${API_URL}/movie?size=1000`);
                if (moviesResponse.ok) {
                    const moviesData = await moviesResponse.json();
                    // Verifica se os dados vêm dentro de .content (Pageable) ou se é Array direto
                    const finalMovies = moviesData.content || moviesData;
                    if (Array.isArray(finalMovies)) {
                        setMovies(finalMovies);
                    }
                }

            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, id]);

    if (!isAuthenticated) {
        return <div>Redirecionando para login...</div>;
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="loadingText">
                    <p>Carregando Conteudo...</p>
                </div>
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="containerFranquia">
                <div className="boxFranquia">
                    <h1>Franquia não encontrada</h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="franquia" style={{ '--background-url': `url(${collection.backgroundFranquia})` }}>
                <div className="containerFranquia">
                    <div className="boxFranquia">
                        <img src={collection.logoFranquia} alt="" />
                        <p>{collection.descricaoFranquia}</p>
                    </div>
                </div>

                <div className="contentFranquia">
                    {series.length > 0 && (
                        <div className="boxInformationPageFranquia">
                            {series
                                .filter(serie => serie.franquia === collection.franquia) 
                                .map(serie => (
                                    <div key={serie.id}>
                                        <a href={`/series/${serie.id}`}>
                                            <img src={serie.imageVertical} alt="" />
                                        </a>
                                    </div>
                                ))
                            }
                        </div>
                    )}

                    {movies.length > 0 && (
                        <div className="boxInformationPageFranquia">
                            {movies
                                .filter(movie => movie.franquia === collection.franquia) 
                                .sort((a, b) => a.year - b.year)
                                .map(movie => (
                                    <div key={movie.id}>
                                        <a href={`/movies/${movie.id}`}>
                                            <img src={movie.imageVertical} alt="" />
                                        </a>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FranquiaPage;