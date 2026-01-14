import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const Favorites = () => {

  const [favoriteMovieList, setFavoriteMovieList] = useState([]);
  const [favoriteSerieList, setFavoriteSerieList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const API_URL = "http://localhost:8080/api";
  const navigate = useNavigate();
  const favRef = useRef(null);


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetch(`${API_URL}/users/${parsedUser.id}`)
        .then((res) => res.json())
        .then((fullUser) => {
          setIsAuthenticated(true);
          setIsAdmin(fullUser.role === 'ADMIN');
          setName(fullUser.name);
          setFavoriteMovieList(fullUser.favoriteMovieList || []);
          setFavoriteSerieList(fullUser.favoriteSeassonList || []);
        })
        .catch((error) => console.error('Erro ao carregar dados:', error));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const allFavorites = [
    ...favoriteMovieList.map((item) => ({
      ...item,
      type: 'MOVIE',
      uniqueKey: `movie-${item.id}`
    })),
    ...favoriteSerieList.map((item) => ({
      ...item,
      type: 'SERIE',
      uniqueKey: `seasson-${item.id}`,
      name: item.name || 'Temporada'
    })),
  ];

  return (
    <div>
      <div className="favoritePageContainer">
        <div className="headerList">
          <h1>Sua Lista, {name}</h1>
        </div>
        {allFavorites.length > 0 && (
          <div className="containerContentPage">
            {allFavorites.map((movie, i) => (
              <div className="boxContent" key={i}>
                <div className="boxInformation">
                  <a href={"/movies/" + movie.id}>
                    <img src={movie.imageVertical} alt={movie.name} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
