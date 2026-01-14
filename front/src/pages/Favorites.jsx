import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Favorites = () => {
  const [favoriteMovieList, setFavoriteMovieList] = useState([]);
  const [favoriteSerieList, setFavoriteSerieList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null); // Corrigido: Estado adicionado
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null); // Corrigido: Para usar no handle
  const API_URL = "http://localhost:8080/api";
  const navigate = useNavigate();

  // Função para buscar dados (centralizada para ser reusada)
  const fetchUserData = (id) => {
    fetch(`${API_URL}/users/${id}`)
      .then((res) => res.json())
      .then((fullUser) => {
        setIsAuthenticated(true);
        setName(fullUser.name);
        setFavoriteMovieList(fullUser.favoriteMovieList || []);
        setFavoriteSerieList(fullUser.favoriteSeassonList || []);
      })
      .catch((error) => console.error('Erro ao carregar dados:', error));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
      fetchUserData(parsedUser.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated || !userId || !selectedMovie) {
      alert("Erro ao processar solicitação.");
      return;
    }

    // Verifica se já é favorito para decidir entre DELETE ou POST
    const isAlreadyFavorite = [...favoriteMovieList, ...favoriteSerieList].some(
      (item) => item.id === selectedMovie.id
    );

    try {
      const method = isAlreadyFavorite ? "DELETE" : "POST";
      const endpoint = selectedMovie.type === 'MOVIE' ? 'movie' : 'serie';

      const response = await fetch(
        `${API_URL}/favorites/${endpoint}/${selectedMovie.id}/${userId}`,
        { method, headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) throw new Error();

      fetchUserData(userId); // Recarrega a lista
      closeModal();
    } catch (error) {
      console.error("Erro ao atualizar favoritos");
    }
  };

  const allFavorites = [
    ...favoriteMovieList.map((item) => ({
      ...item,
      type: 'MOVIE',
      uniqueKey: `movie-${item.id}`
    })),
    ...favoriteSerieList.map((item) => ({
      ...item,
      type: 'SERIE',
      uniqueKey: `serie-${item.id}`,
      name: item.name || 'Temporada'
    })),
  ];

  return (
    <div>
      <div className="favoritePageContainer">
        <div className="headerList">
          <h1>Sua Lista, {name}</h1>
        </div>

        {allFavorites.length > 0 ? (
          <div className="containerContentPage">
            {allFavorites.map((movie) => (
              <div className="boxContent" key={movie.uniqueKey}>
                <div className="boxInformation">
                  <div className="modalIcon">
                    {/* Corrigido: Função anônima no onClick */}
                    <i onClick={() => openModal(movie)} className="fa-solid fa-ellipsis"></i>
                  </div>
                  <a href={`/movies/${movie.id}`}>
                    <img src={movie.imageVertical} alt={movie.name} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="withoutFavorites">
            <span>Adicione itens aos Favoritos</span>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-actions">
              <div className="favoritePageMovieOptions">
                <img className='favotitePageImage' src={selectedMovie.image} alt="" />
                <div className="favoritePageMovieButtons">
                  <button className="btn-confirm" onClick={handleAddToFavorites}>
                    <i class="fa-solid fa-trash"></i> Remover da Lista
                  </button>
                  <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};