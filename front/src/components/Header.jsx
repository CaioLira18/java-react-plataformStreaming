import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const API_URL = "https://java-react-plataformstreaming.onrender.com/api";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const userData = Array.isArray(parsedUser) ? parsedUser[0] : parsedUser;

        setIsAuthenticated(true);
        setName(userData.name);
        setIsAdmin(userData.role === 'ADMIN');
        setUserId(userData.id)
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Formato inesperado para Users:', data);
        }
      })
      .catch(error => console.error('Erro ao buscar Users:', error));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function removeProfile() {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setName('');
    setImage('');
    setUserId('');
    setIsMenuOpen(false);
    navigate('/login');
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="hbo-header">
        <div className="hbo-container">
          <div className="hbo-logo">
            <a href="/">
              <img
                src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1753825253/logo_wzqgvp.png"
                alt="Logo"
              />
            </a>
          </div>

          <nav className="hbo-nav">
            <a href="/" className="hbo-nav-link">Início</a>
            <a href="/series" className="hbo-nav-link">Séries</a>
            <a href="/movies" className="hbo-nav-link">Filmes</a>
            {isAdmin && (
              <a href="/adminpage" className="hbo-nav-link">Admin</a>
            )}
          </nav>

          <div className="hbo-right">
            <a href="/search" className="hbo-search-btn">
              <i className="fa-solid fa-magnifying-glass"></i>
            </a>

            {!isAuthenticated ? (
              <a href="/login" className="hbo-user-btn">
                <i className="fa-solid fa-user"></i>
              </a>
            ) : (
              <div className="hbo-user-menu">
                <img
                  src={users.find(user => user.id == userId)?.photo || "https://res.cloudinary.com/dthgw4q5d/image/upload/v1753994647/icon_fzzpew.png"}
                  alt="Perfil"
                  className="hbo-user-avatar"
                />
                <div className="hbo-dropdown">
                  <div className="hbo-dropdown-header">
                    <div className="hbo-dropdown-name">{name}</div>
                  </div>
                  <a href="/Edit" className="hbo-dropdown-item">
                    <i className="fa-solid fa-user"></i>
                    <span>Minha Conta</span>
                  </a>
                  {isAdmin && (
                    <a href="/adminpage" className="hbo-dropdown-item">
                      <i className="fa-solid fa-user-shield"></i>
                      <span>Admin Portal</span>
                    </a>
                  )}
                  <div className="hbo-dropdown-item hbo-logout" onClick={removeProfile}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Sair</span>
                  </div>
                </div>
              </div>
            )}

            <button className="hbo-mobile-toggle" onClick={toggleMenu}>
              <i className={isMenuOpen ? "fa-solid fa-times" : "fa-solid fa-bars"}></i>
            </button>
          </div>
        </div>
      </header>

      <div className={`hbo-mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      <div className={`hbo-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="hbo-mobile-header">
          <div className="hbo-logo">
            <img
              src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1753825253/logo_wzqgvp.png"
              alt="Logo"
            />
          </div>
          <button className="hbo-mobile-close" onClick={closeMenu}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <nav className="hbo-mobile-nav">
          <a href="/" className="hbo-mobile-link" onClick={closeMenu}>
            <i className="fa-solid fa-house"></i>
            <span>Início</span>
          </a>
          <a href="/series" className="hbo-mobile-link" onClick={closeMenu}>
            <i className="fa-solid fa-clapperboard"></i>
            <span>Séries</span>
          </a>
          <a href="/movies" className="hbo-mobile-link" onClick={closeMenu}>
            <i className="fa-solid fa-film"></i>
            <span>Filmes</span>
          </a>
          <a href="/search" className="hbo-mobile-link" onClick={closeMenu}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Pesquisar</span>
          </a>
          {isAdmin && (
            <a href="/adminpage" className="hbo-mobile-link" onClick={closeMenu}>
              <i className="fa-solid fa-user-shield"></i>
              <span>Admin Page</span>
            </a>
          )}
        </nav>

        <div className="hbo-mobile-user">
          {!isAuthenticated ? (
            <a href="/login" className="hbo-mobile-link" onClick={closeMenu}>
              <i className="fa-solid fa-user"></i>
              <span>Fazer Login</span>
            </a>
          ) : (
            <>
              <a href="/Edit" className="hbo-mobile-link" onClick={closeMenu}>
                <img
                  src={image || "https://res.cloudinary.com/dthgw4q5d/image/upload/v1753994647/icon_fzzpew.png"}
                  alt="Perfil"
                  style={{ width: '24px', height: '24px', borderRadius: '4px' }}
                />
                <span>{name}</span>
              </a>
              <div className="hbo-mobile-link" onClick={removeProfile} style={{ color: '#e74c3c' }}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sair</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;