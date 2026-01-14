import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DeleteMoviePage = () => {
  const [name, setName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [movies, setMovies] = useState([]);

  // Estados para o Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = "http://localhost:8080/api";
  const navigate = useNavigate();

  // Autenticação e dados do usuário
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetch(`${API_URL}/users/${parsedUser.id}`)
        .then((res) => res.json())
        .then((fullUser) => {
          setName(fullUser.name || '');
          setIsAuthenticated(true);
        })
        .catch((error) => console.error('Erro ao carregar dados:', error));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetch(`${API_URL}/movie`)
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar Filmes.");
        return response.json();
      })
      .then((data) => {
        setMovies(data.content || []);
      })
      .catch((error) => {
        console.error(error);
        setMovies([]);
      });
  }, []);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleDelete = async (movieId) => {
    try {
      const response = await fetch(`${API_URL}/movie/${movieId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMovies(movies.filter(m => m.id !== movieId));
        closeModal();
        alert("Filme excluído com sucesso!");
      } else {
        alert("Erro ao excluir o filme.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  function handleSearch(e) {
    setSearchTerm(e.target.value);
  }

  const filteredItems = movies.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="deletePage">

      <div className="searchInput">
        <div className="boxSearchInput">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            value={searchTerm}
            onChange={handleSearch}
            placeholder='Pesquise algum filme ou série'
            type="text"
          />
        </div>
      </div>

      <div className="itemPageContainer">
        {Array.isArray(movies) && movies.length > 0 ? (
          filteredItems.map((movie) => (
            <div key={movie.id} className="itemPageBox" onClick={() => openModal(movie)}>
              <div className="itemPageBoxImage">
                <img src={movie.image} alt={`Imagem do Filme ${movie.name}`} />
              </div>
              <div className="itemPageBoxInformation">
                <span><strong>{movie.name}</strong></span>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum filme carregado.</p>
        )}
      </div>

      {/* Estrutura do Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Confirmar Exclusão</h2>
            <p>Você tem certeza que deseja excluir o filme: <strong>{selectedMovie?.name}</strong>?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="btn-confirm" onClick={() => handleDelete(selectedMovie.id)}>Confirmar Exclusão</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteMoviePage;