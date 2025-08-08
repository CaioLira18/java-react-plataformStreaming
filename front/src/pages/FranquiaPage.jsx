import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const FranquiaPage = () => {
    const { id } = useParams(); // Pega o ID da URL
    const navigate = useNavigate();
    const API_URL = "http://localhost:8080/api";
    
    const [series, setSeries] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [collection, setCollection] = useState(null); // Mudei para null pois será um objeto
    const [loading, setLoading] = useState(true);

    // Verificar autenticação primeiro
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

    // Buscar dados quando autenticado
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                // Buscar a collection específica pelo ID
                const collectionResponse = await fetch(`${API_URL}/collections/${id}`);
                if (collectionResponse.ok) {
                    const collectionData = await collectionResponse.json();
                    setCollection(collectionData);
                } else {
                    console.error('Collection não encontrada');
                }

                // Buscar séries
                const seriesResponse = await fetch(`${API_URL}/series`);
                if (seriesResponse.ok) {
                    const seriesData = await seriesResponse.json();
                    if (Array.isArray(seriesData)) {
                        setSeries(seriesData);
                    }
                }

                // Buscar filmes
                const moviesResponse = await fetch(`${API_URL}/movie`);
                if (moviesResponse.ok) {
                    const moviesData = await moviesResponse.json();
                    if (Array.isArray(moviesData)) {
                        setMovies(moviesData);
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
            <div className="containerFranquia">
                <div className="boxFranquia">
                    <h1>Carregando...</h1>
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
            <div className="franquia"  style={{'--background-url': `url(${collection.backgroundFranquia})`,}}>
                <div className="containerFranquia">
                    <div className="boxFranquia">
                        <img src={collection.logoFranquia} alt="" />
                        <p>{collection.descricaoFranquia}</p>
                    </div>
            </div>
            
            <div className="contentFranquia">
            {/* Você pode adicionar aqui a lógica para filtrar filmes/séries desta franquia */}
            {series.length > 0 && (
                <div className="boxInformationPage">
                    {series
                        .filter(serie => serie.franquiaId === id) // Ajuste conforme sua estrutura
                        .map(serie => (
                            <div key={serie.id}>
                                <h3>{serie.titulo}</h3>
                            </div>
                        ))
                    }
                </div>
            )}

            {movies.length > 0 && (
                <div className="boxInformationPageFranquia">
                    {movies
                        .filter(movie => movie.franquia === collection.franquia) // Ajuste conforme sua estrutura
                        .map(movie => (
                            <div>
                                <a href={`/movies/${movie.id}`}><img src={movie.imageVertical} alt="" /></a>
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