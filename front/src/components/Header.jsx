// Header.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const userData = Array.isArray(parsedUser) ? parsedUser[0] : parsedUser; 

        setIsAuthenticated(true);
        setName(userData.name);
        setIsAdmin(userData.role === 'ADMIN');
        setImage(userData.profileImage);

        console.log("Dados do usuário carregados:", userData);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    } else {
      console.log("Nenhum usuário encontrado no localStorage");
    }
  }, []);

  // Fechar menu ao redimensionar para desktop
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
    <div>
      <div className="header">
        <div className="headerContainer">
          {/* Logo */}
          <div className="logoHeader">
            <a href="/">
              <img
                src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1753825253/logo_wzqgvp.png"
                alt="Logo"
              />
            </a>
          </div>

          {/* Menu Hamburger - Apenas Mobile */}
          <div className="mobileMenuIcon" onClick={toggleMenu}>
            <i className={isMenuOpen ? "fa-solid fa-times" : "fa-solid fa-bars"}></i>
          </div>

          {/* Overlay para fechar menu mobile */}
          {isMenuOpen && <div className="mobileOverlay" onClick={closeMenu}></div>}

          {/* Navegação */}
          <div className={`optionsHeader ${isMenuOpen ? 'mobileMenuOpen' : ''}`}>
            {/* Menu de Navegação */}
            <ul className="navigationMenu">
              <li>
                <div className="headerOption">
                  <a href="/" onClick={closeMenu}> 
                    <i className="fa-solid fa-house"></i>
                    <span>Home</span>
                  </a>
                </div>
              </li>
              <li>
                <div className="headerOption">
                  <a href="/movies" onClick={closeMenu}> 
                    <i className="fa-solid fa-film"></i>
                    <span>Filmes</span>
                  </a>
                </div>
              </li>
              <li>
                <div className="headerOption">
                  <a href="/series" onClick={closeMenu}> 
                    <i className="fa-solid fa-clapperboard"></i>
                    <span>Series</span>
                  </a>
                </div>
              </li>
              <li>
                <div className="headerOption">
                  <a href="/search" onClick={closeMenu}> 
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Pesquisar</span>
                  </a>
                </div>
              </li>
              {isAdmin && (
              <li>
                <div className="headerOption">
                  <a href="/adminpage" onClick={closeMenu}> 
                    <span>Admin Page</span>
                  </a>
                </div>
              </li>
              )}
            </ul>

            {/* Menu de Perfil/Login */}
            <div className="rightMenu">
              {!isAuthenticated ? (
                <a href="/login" className="loginBtn" onClick={closeMenu}>
                  <i className="fa-solid fa-user"></i>
                  <span>Perfil</span>
                </a>
              ) : (
                <div className='authenticatedBox'>
                  <div className="iconName">
                    <img 
                      src={image || "https://res.cloudinary.com/dthgw4q5d/image/upload/v1753994647/icon_fzzpew.png"} 
                      alt="Perfil" 
                    />
                    <a href="/Edit" onClick={closeMenu}>{name}</a>
                  </div>
                  <div className="logOutBox" onClick={removeProfile}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Sair</span>
                  </div>
                </div>
              )}

              {/* Portal Admin - apenas para admin */}
              {isAdmin && (
                <a href="/adminpage" className="adminPortalBtn" onClick={closeMenu}>
                  <i className="fa-solid fa-user-shield"></i>
                  <span>Portal de Admin</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;