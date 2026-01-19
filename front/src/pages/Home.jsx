import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Slide from '../components/Slide';

const Home = () => {
  const API_URL = "https://java-react-plataformstreaming-8f2k.onrender.com/api";

  // Estados de Dados
  const [series, setSeries] = useState([]);
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [favoriteMovieList, setFavoriteMovieList] = useState([]);
  const [favoriteSerieList, setFavoriteSerieList] = useState([]);

  // Estados de Controle e Modal
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openModalItem, setOpenModalItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });

  // Refs para Scroll
  const seriesRef = useRef(null);
  const favRef = useRef(null);
  const moviesRef = useRef(null);
  const disneyRef = useRef(null);
  const dcRef = useRef(null);
  const cartoonRef = useRef(null);
  const destaquesRef = useRef(null);

  const navigate = useNavigate();

  // --- FUNÇÕES DE CARREGAMENTO ---

  const fetchUserData = (userId) => {
    fetch(`${API_URL}/users/${userId}`)
      .then((res) => res.json())
      .then((fullUser) => {
        setUser(fullUser);
        setIsAuthenticated(true);
        setIsAdmin(fullUser.role === 'ADMIN');
        setFavoriteMovieList(fullUser.favoriteMovieList || []);
        setFavoriteSerieList(fullUser.favoriteSeriesList || []);
      })
      .catch((error) => console.error('Erro ao carregar dados do usuário:', error));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetchUserData(parsedUser.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetch(`${API_URL}/movie?page=0&size=12`).then(res => res.json()).then(data => setMovies(data.content || []));
    fetch(`${API_URL}/series?page=0&size=12`).then(res => res.json()).then(data => setSeries(data.content || []));
  }, []);

  // --- LÓGICA DE INTERAÇÃO ---

  const scroll = (ref, direction) => {
    if (!ref.current) return;
    const scrollAmount = 300;
    ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const openModal = (e, item, type) => {
    e.preventDefault();
    e.stopPropagation();

    // Captura a posição exata do clique para colar o modal no item
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPos({
      x: rect.left - 190, // Ajuste para o modal abrir à esquerda da elipse
      y: rect.top + window.scrollY + 25
    });

    setSelectedItem({ ...item, itemType: type });
    setOpenModalItem(true);
  };

  const closeModal = () => {
    setOpenModalItem(false);
    setSelectedItem(null);
  };

  const handleAddMovieToFavorites = async (movieId) => {
    const isAlreadyFavorite = favoriteMovieList.some((item) => item.id === movieId);
    const method = isAlreadyFavorite ? "DELETE" : "POST";
    await fetch(`${API_URL}/favorites/movie/${movieId}/${user.id}`, { method });
    fetchUserData(user.id);
    closeModal();
  };

  const handleAddSerieToFavorites = async (serieId) => {
    const isAlreadyFavorite = favoriteSerieList.some((item) => item.id === serieId);
    const method = isAlreadyFavorite ? "DELETE" : "POST";
    await fetch(`${API_URL}/favorites/series/${serieId}/${user.id}`, { method });
    fetchUserData(user.id);
    closeModal();
  };

  if (!isAuthenticated) return null;

  const allFavorites = [
    ...favoriteMovieList.map(item => ({ ...item, type: 'MOVIE', uniqueKey: `mov-${item.id}` })),
    ...favoriteSerieList.map(item => ({ ...item, type: 'SERIE', uniqueKey: `ser-${item.id}` }))
  ];

  const movieIsInFavorites = selectedItem?.itemType === 'MOVIE' && favoriteMovieList.some((item) => item.id === selectedItem.id);
  const serieIsInFavorites = selectedItem?.itemType === 'SERIE' && favoriteSerieList.some((item) => item.id === selectedItem.id);

  return (
    <div className='home'>
      <Slide />

      {/* MINHA LISTA */}
      {allFavorites.length > 0 && (
        <div className="genericContentBox">
          <div className="flexHomeSecction">
            <h1>Minha Lista</h1>
            <a href="/">Mostrar Tudo</a>
          </div>
          <div className="slideWrapper">
            <div className="sliderControls left" onClick={() => scroll(favRef, 'left')}>
              <i className="fa-solid fa-angle-left"></i>
            </div>
            <div className="containerContent" ref={favRef}>
              {allFavorites.map((item) => (
                <div className="boxContent" key={item.uniqueKey}>
                  <div className="boxInformation">
                    <div>
                      {/* CORREÇÃO: Removidas as chaves extras no terceiro argumento do openModal */}
                      <div
                        className="ellipsisBox"
                        onClick={(e) => openModal(e, item, item.type === "SERIE" ? 'SERIE' : 'MOVIE')}
                      >
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </div>

                      <a href={`/${item.type === 'SERIE' ? 'series' : 'movies'}/${item.id}`}>
                        <img src={item.imageVertical || item.image} alt={item.name} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="sliderControls right" onClick={() => scroll(favRef, 'right')}>
              <i className="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO SÉRIES */}
      <div className="genericContentBox">
        <div className="flexHomeSecction"><h1>Séries</h1><a href="/series">Mostrar Tudo</a></div>
        <div className="slideWrapper">
          <div className="sliderControls left" onClick={() => scroll(seriesRef, 'left')}><i className="fa-solid fa-angle-left"></i></div>
          <div className="containerContent" ref={seriesRef}>
            {series.map((item) => (
              <div className="boxContent" key={item.id}>
                <div className="boxInformation">
                  <div className="ellipsisBox" onClick={(e) => openModal(e, item, 'SERIE')}><i className="fa-solid fa-ellipsis-vertical"></i></div>
                  <a href={`/series/${item.id}`}><img src={item.imageVertical} alt={item.name} /></a>
                </div>
              </div>
            ))}
          </div>
          <div className="sliderControls right" onClick={() => scroll(seriesRef, 'right')}><i className="fa-solid fa-angle-right"></i></div>
        </div>
      </div>

      {/* SEÇÃO FILMES */}
      <div className="genericContentBox">
        <div className="flexHomeSecction"><h1>Filmes</h1><a href="/movies">Mostrar tudo</a></div>
        <div className="slideWrapper">
          <div className="sliderControls left" onClick={() => scroll(moviesRef, 'left')}><i className="fa-solid fa-angle-left"></i></div>
          <div className="containerContent" ref={moviesRef}>
            {movies.map((item) => (
              <div className="boxContent" key={item.id}>
                <div className="boxInformation">
                  <div className="ellipsisBox" onClick={(e) => openModal(e, item, 'MOVIE')}><i className="fa-solid fa-ellipsis-vertical"></i></div>
                  <a href={`/movies/${item.id}`}><img src={item.imageVertical} alt={item.name} /></a>
                </div>
              </div>
            ))}
          </div>
          <div className="sliderControls right" onClick={() => scroll(moviesRef, 'right')}><i className="fa-solid fa-angle-right"></i></div>
        </div>
      </div>

      {/* SEÇÃO DISNEY */}
      <div className="genericContentBox">
        <div className="specialSecction"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070612/logoDisney_twejpl.png" alt="logo disney" /></div>
        <div className="slideWrapper">
          <div className="sliderControls left" onClick={() => scroll(disneyRef, 'left')}><i className="fa-solid fa-angle-left"></i></div>
          <div className="containerContent" ref={disneyRef}>
            {movies.filter(item => item.marca === "DISNEY").map((item) => (
              <div className="boxContent" key={item.id}>
                <div className="boxInformation">
                  <div className="ellipsisBox" onClick={(e) => openModal(e, item, 'MOVIE')}><i className="fa-solid fa-ellipsis-vertical"></i></div>
                  <a href={`/movies/${item.id}`}><img src={item.imageVertical} alt={item.name} /></a>
                </div>
              </div>
            ))}
          </div>
          <div className="sliderControls right" onClick={() => scroll(disneyRef, 'right')}><i className="fa-solid fa-angle-right"></i></div>
        </div>
      </div>

      {/* SEÇÃO DC */}
      <div className="genericContentBox">
        <div className="specialSecction"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070853/DClOGO_izlahe.png" alt="logo dc" /></div>
        <div className="slideWrapper">
          <div className="sliderControls left" onClick={() => scroll(dcRef, 'left')}><i className="fa-solid fa-angle-left"></i></div>
          <div className="containerContent" ref={dcRef}>
            {movies.filter(item => item.marca === "DC").map((item) => (
              <div className="boxContent" key={item.id}>
                <div className="boxInformation">
                  <div className="ellipsisBox" onClick={(e) => openModal(e, item, 'MOVIE')}><i className="fa-solid fa-ellipsis-vertical"></i></div>
                  <a href={`/movies/${item.id}`}><img src={item.imageVertical} alt={item.name} /></a>
                </div>
              </div>
            ))}
          </div>
          <div className="sliderControls right" onClick={() => scroll(dcRef, 'right')}><i className="fa-solid fa-angle-right"></i></div>
        </div>
      </div>

      {/* SEÇÃO CARTOON */}
      <div className="genericContentBox">
        <div className="specialSecction"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754688018/logoMarcaCartoon_of4twi.png" alt="logo cartoon" /></div>
        <div className="slideWrapper">
          <div className="sliderControls left" onClick={() => scroll(cartoonRef, 'left')}><i className="fa-solid fa-angle-left"></i></div>
          <div className="containerContent" ref={cartoonRef}>
            {series.filter(item => item.marca === "CARTOON").map((item) => (
              <div className="boxContent" key={item.id}>
                <div className="boxInformation">
                  <div className="ellipsisBox" onClick={(e) => openModal(e, item, 'SERIE')}><i className="fa-solid fa-ellipsis-vertical"></i></div>
                  <a href={`/series/${item.id}`}><img src={item.imageVertical} alt={item.name} /></a>
                </div>
              </div>
            ))}
          </div>
          <div className="sliderControls right" onClick={() => scroll(cartoonRef, 'right')}><i className="fa-solid fa-angle-right"></i></div>
        </div>
      </div>

      {/* SEÇÃO DESTAQUES */}
      <div className="genericContentBox">
        <div className="flexHomeSecction"><h1>Destaques</h1><a href="/series">Mostrar Tudo</a></div>
        <div className="slideWrapper">
          <div className="sliderControls left" onClick={() => scroll(destaquesRef, 'left')}><i className="fa-solid fa-angle-left"></i></div>
          <div className="containerContent" ref={destaquesRef}>
            {series.map((item) => (
              <div className="boxContent" key={item.id}>
                <div className="boxInformation">
                  <div className="ellipsisBox" onClick={(e) => openModal(e, item, 'SERIE')}><i className="fa-solid fa-ellipsis-vertical"></i></div>
                  <a href={`/series/${item.id}`}><img src={item.imageVertical} alt={item.name} /></a>
                </div>
              </div>
            ))}
          </div>
          <div className="sliderControls right" onClick={() => scroll(destaquesRef, 'right')}><i className="fa-solid fa-angle-right"></i></div>
        </div>
      </div>

      {/* MODAL DROPDOWN POSICIONADO DINAMICAMENTE */}
      {openModalItem && selectedItem && (
        <>
          <div className="modal-streaming-overlay" onClick={closeModal}></div>
          <div
            className="modal-streaming-content"
            style={{
              top: `${modalPos.y}px`,
              left: `${modalPos.x}px`
            }}
          >
            <button
              className="modal-streaming-item"
              onClick={() => {
                selectedItem.itemType === "MOVIE"
                  ? handleAddMovieToFavorites(selectedItem.id)
                  : handleAddSerieToFavorites(selectedItem.id);
              }}
            >
              <i className={`fa-solid ${(selectedItem.itemType === "MOVIE" ? movieIsInFavorites : serieIsInFavorites)
                ? 'fa-check' : 'fa-plus'
                }`}></i>
              <span>
                {(selectedItem.itemType === "MOVIE" ? movieIsInFavorites : serieIsInFavorites)
                  ? "Remover da lista" : "Adicionar à minha lista"}
              </span>
            </button>

            <NavLink
              to={`/${selectedItem.itemType === 'MOVIE' ? 'movies' : 'series'}/${selectedItem.id}`}
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

export default Home;