import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Favorites = () => {
  const [favoriteMovieList, setFavoriteMovieList] = useState([]);
  const [favoriteSerieList, setFavoriteSerieList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Corrigido: Estado adicionado
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null); // Corrigido: Para usar no handle
  // const API_URL = "http://localhost:8080/api";
  const API_URL = "https://java-react-plataformstreaming.onrender.com/api";
  const navigate = useNavigate();

  // Função para buscar dados (centralizada para ser reusada)
  const fetchUserData = (id) => {
    fetch(`${API_URL}/users/${id}`)
      .then((res) => res.json())
      .then((fullUser) => {
        setIsAuthenticated(true);
        setName(fullUser.name);
        setFavoriteMovieList(fullUser.favoriteMovieList || []);
        setFavoriteSerieList(fullUser.favoriteSeriesList || []);
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

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated || !userId || !selectedItem) {
      alert("Erro ao processar solicitação.");
      return;
    }

    // Verifica se já é favorito para decidir entre DELETE ou POST
    const isAlreadyFavorite = [...favoriteMovieList, ...favoriteSerieList].some(
      (item) => item.id === selectedItem.id
    );

    try {
      const method = isAlreadyFavorite ? "DELETE" : "POST";
      const endpoint = selectedItem.type === 'MOVIE' ? 'movie' : 'series';

      const response = await fetch(
        `${API_URL}/favorites/${endpoint}/${selectedItem.id}/${userId}`,
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
            {allFavorites.map((item) => (
              <div className="boxContent" key={item.uniqueKey}>
                <div className="boxInformation">
                  <div className="modalIcon">
                    {/* Corrigido: Função anônima no onClick */}
                    <i onClick={() => openModal(item)} className="fa-solid fa-ellipsis"></i>
                  </div>
                  {item.type == "MOVIE" && (
                    <a href={`/movies/${item.id}`}>
                      <img src={item.imageVertical} alt={item.name} />
                    </a>
                  )}
                  {item.type == "SERIE" && (
                    <a href={`/series/${item.id}`}>
                      <img src={item.imageVertical} alt={item.name} />
                    </a>
                  )}
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
                <img className='favotitePageImage' src={selectedItem.image} alt="" />
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