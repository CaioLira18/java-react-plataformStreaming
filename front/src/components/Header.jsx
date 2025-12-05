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
    setIsMenuOpen(false); // Fechar menu ao sair
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
            <img
              src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1753825253/logo_wzqgvp.png"
              alt="Logo"
            />
          </div>

          {/* Menu Hamburger - Apenas Mobile */}
          <div className="mobileMenuIcon" onClick={toggleMenu}>
            <i className={isMenuOpen ? "fa-solid fa-times" : "fa-solid fa-bars"}></i>
          </div>

          {/* Overlay para fechar menu mobile */}
          {isMenuOpen && <div className="mobileOverlay" onClick={closeMenu}></div>}

          {/* Navegação */}
          <div className={`optionsHeader ${isMenuOpen ? 'mobileMenuOpen' : ''}`}>
            <ul className="navigationMenu">
              <li>
                 <div className="headerOption">
                  <a href="/" onClick={closeMenu}> 
                  <i class="fa-solid fa-house"></i>
                  Home
                  </a>
                </div>
              </li>
              <li>
                 <div className="headerOption">
                  <a href="/movies" onClick={closeMenu}> 
                  <i class="fa-solid fa-film"></i>
                  Filmes
                  </a>
                </div>
              </li>
              <li>
                 <div className="headerOption">
                  <a href="/series" onClick={closeMenu}> 
                  <i class="fa-solid fa-clapperboard"></i>
                  Series
                  </a>
                </div>
              </li>
              <li>
                <div className="headerOption">
                  <a href="/search" onClick={closeMenu}> 
                  <i className="fa-solid fa-magnifying-glass"></i>
                  Pesquisar
                  </a>
                </div>
              </li>
            </ul>

            <ul className="profileMenu">
              <li className='liProfile'>
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
              </li>
            </ul>

            <ul>
              <li>
                <div className='authenticatedBox'>
                    <div className="iconName">
                      
                      <a href="/adminpage" onClick={closeMenu}>Portal de Admin</a>
                    </div>
                  </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;