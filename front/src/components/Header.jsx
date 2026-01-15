import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  // const API_URL = "https://java-react-plataformstreaming.onrender.com/api";
  const API_URL = "http://localhost:8080/api";

  const links = [
    { name: 'Início', to: '/' },
    { name: 'Séries', to: '/series' },
    { name: 'Filmes', to: '/movies' },
  ];

  // Autenticação
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const userData = Array.isArray(parsedUser) ? parsedUser[0] : parsedUser;

        setIsAuthenticated(true);
        setName(userData.name);
        setIsAdmin(userData.role === 'ADMIN');
        setUserId(userData.id);
        setImage(userData.photo);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    }
  }, []);

  // Buscar usuários
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${API_URL}/users`)
        .then(res => res.json())
        .then(data => Array.isArray(data) && setUsers(data))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated]);

  // Resize mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const removeProfile = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setName('');
    setImage(null);
    setUserId(null);
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const userPhoto =
    users.find(u => u.id === userId)?.photo ||
    image ||
    "https://res.cloudinary.com/dthgw4q5d/image/upload/v1753994647/icon_fzzpew.png";

  return (
    <>
      <header className="hbo-header">
        <div className="hbo-container">
          <div className="hbo-logo">
            <NavLink to="/">
              <img
                src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1753825253/logo_wzqgvp.png"
                alt="Logo"
              />
            </NavLink>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hbo-nav">
            {links.map(link => (
              <NavLink
                key={link.name}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `hbo-nav-link ${isActive ? 'active' : ''}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hbo-right">
            <NavLink to="/search" className="hbo-search-btn">
              <i className="fa-solid fa-magnifying-glass"></i>
            </NavLink>

            <NavLink to="/favorites" className="hbo-search-btn">
              <i class="fa-regular fa-bookmark"></i>
            </NavLink>

            {!isAuthenticated ? (
              <NavLink to="/login" className="hbo-user-btn">
                <i className="fa-solid fa-user"></i>
              </NavLink>
            ) : (
              <div className="hbo-user-menu">
                <img src={userPhoto} alt="Perfil" className="hbo-user-avatar" />

                <div className="hbo-dropdown">
                  <div className="hbo-dropdown-header">
                    <div className="hbo-dropdown-name">{name}</div>
                  </div>

                  <NavLink to="/Edit" className="hbo-dropdown-item">
                    <i className="fa-solid fa-user"></i>
                    <span>Minha Conta</span>
                  </NavLink>

                  {isAdmin && (
                    <NavLink to="/adminpage" className="hbo-dropdown-item">
                      <i className="fa-solid fa-user-shield"></i>
                      <span>Admin Portal</span>
                    </NavLink>
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

      {/* OVERLAY */}
      <div
        className={`hbo-mobile-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />

      {/* MOBILE MENU */}
      <div className={`hbo-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="hbo-mobile-header">
          <button className='closeMenuHeader' onClick={closeMenu}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <nav className="hbo-mobile-nav">
          {links.map(link => (
            <NavLink
              key={link.name}
              to={link.to}
              end={link.to === '/'}
              onClick={closeMenu}
              className={({ isActive }) =>
                `hbo-mobile-link ${isActive ? 'active' : ''}`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <NavLink to="/search" onClick={closeMenu} className="hbo-mobile-link">
            Pesquisar
          </NavLink>

          {isAdmin && (
            <NavLink to="/adminpage" onClick={closeMenu} className="hbo-mobile-link">
              Admin Page
            </NavLink>
          )}
        </nav>

        <div className="hbo-mobile-user">
          {!isAuthenticated ? (
            <NavLink to="/login" onClick={closeMenu} className="hbo-mobile-link">
              Fazer Login
            </NavLink>
          ) : (
            <>
              <NavLink to="/Edit" onClick={closeMenu} className="hbo-mobile-link">
                <img
                  src={userPhoto}
                  alt="Perfil"
                  style={{ width: 24, height: 24, borderRadius: 4 }}
                />
                {name}
              </NavLink>

              <div
                className="hbo-mobile-link"
                onClick={removeProfile}
                style={{ color: '#e74c3c' }}
              >
                Sair
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
