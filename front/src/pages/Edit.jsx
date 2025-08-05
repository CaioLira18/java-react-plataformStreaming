import { useEffect, useState } from 'react';

const Edit = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [favoriteMovieList, setFavoriteMovieList] = useState([]);
  const [favoriteSeassonList, setFavoriteSeassonList] = useState([]);
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);

      fetch(`http://localhost:8080/api/users/${parsedUser.id}`)
        .then((res) => res.json())
        .then((fullUser) => {
          setIsAuthenticated(true);
          setIsAdmin(fullUser.role === 'ADMIN');
          setName(fullUser.name || '');
          setEmail(fullUser.email || '');
          setCpf(fullUser.cpf || '');
          setFavoriteMovieList(fullUser.favoriteMovieList || []);
          setFavoriteSeassonList(fullUser.favoriteSeassonList || []);
        })
        .catch((error) => {
          console.error('Erro ao carregar dados:', error);
          setMessage('Erro ao carregar dados');
          setMessageType('error');
        });
    }
  }, []);

  const handleRemoveToFavorites = async (item) => {
    if (!userId) return alert('Você precisa estar logado.');

    const url = item.type === 'MOVIE'
      ? `http://localhost:8080/api/users/${userId}/remove-movie/${item.id}`
      : `http://localhost:8080/api/users/${userId}/remove-seasson/${item.id}`;

    try {
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar');

      if (item.type === 'MOVIE')
        setFavoriteMovieList((prev) => prev.filter((m) => m.id !== item.id));
      else
        setFavoriteSeassonList((prev) => prev.filter((s) => s.id !== item.id));

      alert('Removido da lista!');
    } catch (err) {
      console.error(err);
      alert('Erro ao remover');
    }
  };

  const allFavorites = [
    ...favoriteMovieList.map((item) => ({ ...item, id: item.id || item.movieId, type: 'MOVIE' })),
    ...favoriteSeassonList.map((item) => ({ ...item, id: item.id || item.seassonId, type: 'SERIE' })),
  ];

  if (!isAuthenticated) return <p>Carregando...</p>;

  return (
    <div>
      <div className="edit">
        <h1>Editar Informações</h1>
        {/* ... campos de edição omitidos por brevidade ... */}
      </div>

      {allFavorites.length > 0 && (
        <div className="myList">
          <div className="boxMyList">
            <h1>Minha Lista</h1>
            <div className="favoritesGrid">
              {allFavorites.map((item) => (
                <div key={`${item.type}-${item.id}`} className="favoriteContainer">
                  <img src={item.imageVertical || item.image} alt={item.name} className="favoriteImage" />

                  <div className="menuButton">
                    <button onClick={() => setMenuOpenId(prev => prev === item.id ? null : item.id)}>
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                  </div>

                  {menuOpenId === item.id && (
                    <div className="dropdownMenu">
                      <button onClick={() => handleRemoveToFavorites(item)}>
                        <i className="fa-solid fa-trash"></i> Remover
                      </button>
                    </div>
                  )}

                  <a className="favoriteLink" href={item.type === 'MOVIE' ? `/movies/${item.id}` : `/series/${item.serieId || item.id}`}></a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;
