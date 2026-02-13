import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

export const Favorites = () => {
  const [favoriteMovieList, setFavoriteMovieList] = useState([]);
  const [favoriteSerieList, setFavoriteSerieList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null);
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });
  const [pageBackground, setPageBackground] = useState("");

  const API_URL = "https://java-react-plataformstreaming-8f2k.onrender.com/api";
  const navigate = useNavigate();

  const fetchUserData = (id) => {
    fetch(`${API_URL}/users/${id}`)
      .then((res) => res.json())
      .then((fullUser) => {
        setIsAuthenticated(true);
        setName(fullUser.name);
        setFavoriteMovieList(fullUser.favoriteMovieList || []);
        setFavoriteSerieList(fullUser.favoriteSeassonList || fullUser.favoriteSeriesList || []);
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

  const openModal = (e, item, type) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    setModalPos({
      x: rect.left - 190,
      y: rect.top + window.scrollY + 25
    });

    setSelectedItem({ ...item, itemType: type });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const movieIsInFavorites = selectedItem?.itemType === 'MOVIE' && favoriteMovieList.some((item) => item.id === selectedItem.id);
  const serieIsInFavorites = selectedItem?.itemType === 'SERIE' && favoriteSerieList.some((item) => item.id === selectedItem.id);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !userId || !selectedItem) return;

    const isMovie = selectedItem.itemType === 'MOVIE';
    const isAlreadyFavorite = isMovie ? movieIsInFavorites : serieIsInFavorites;
    const endpoint = isMovie ? 'movie' : 'series';
    const method = isAlreadyFavorite ? "DELETE" : "POST";

    try {
      const response = await fetch(
        `${API_URL}/favorites/${endpoint}/${selectedItem.id}/${userId}`,
        { method }
      );

      if (response.ok) {
        fetchUserData(userId);
        closeModal();
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos", error);
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
      <div
        className="favoritePageContainer"
        style={{
          backgroundImage: pageBackground
            ? `linear-gradient(to bottom, rgba(0,0,0,0.85), #000), url(${pageBackground})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "background-image 0.2s ease-in-out"
        }}
      >
        <div className="headerList">
          <h1>Sua Lista, {name}</h1>
        </div>

        {allFavorites.length > 0 ? (
          <div className="containerContentPage">
            {allFavorites.map((item) => (
              <div
                className="boxContent"
                key={item.uniqueKey}
                onMouseEnter={() => setPageBackground(item.image)}
                onMouseLeave={() => setPageBackground("")}
              >
                <div className="boxInformation">
                  <div
                    className="ellipsisBox"
                    onClick={(e) => openModal(e, item, item.type)}
                  >
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </div>

                  <a href={`/${item.type === "MOVIE" ? "movies" : "series"}/${item.id}`}>
                    <img
                      src={item.imageVertical || item.image}
                      alt={item.name}
                    />
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

      {isModalOpen && selectedItem && (
        <>
          <div className="modal-streaming-overlay" onClick={closeModal}></div>
          <div
            className="modal-streaming-content"
            style={{
              top: `${modalPos.y}px`,
              left: `${modalPos.x}px`
            }}
          >
            <button className="modal-streaming-item" onClick={handleToggleFavorite}>
              <i className={`fa-solid ${selectedItem.itemType === "MOVIE" 
                ? (movieIsInFavorites ? "fa-check" : "fa-plus") 
                : (serieIsInFavorites ? "fa-check" : "fa-plus")}`}>
              </i>
              <span>
                {selectedItem.itemType === "MOVIE"
                  ? (movieIsInFavorites ? "Remover da lista" : "Adicionar à minha lista")
                  : (serieIsInFavorites ? "Remover da lista" : "Adicionar à minha lista")}
              </span>
            </button>

            <NavLink
              to={`/${selectedItem.itemType === "MOVIE" ? "movies" : "series"}/${selectedItem.id}`}
              className="modal-streaming-item"
            >
              <i className="fa-solid fa-circle-info"></i>
              <span>Mais informações</span>
            </NavLink>

            <button className="modal-streaming-item" onClick={closeModal}>
              <i className="fa-solid fa-xmark"></i>
              <span>Fechar</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};