import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DeleteSeriePage = () => {
  const [name, setName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [series, setSeries] = useState([]);

  // Estados para o Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = "http://localhost:8080/api";
  const navigate = useNavigate();

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
    fetch(`${API_URL}/series`)
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar Series.");
        return response.json();
      })
      .then((data) => {
        setSeries(data.content || []);
      })
      .catch((error) => {
        console.error(error);
        setSeries([]);
      });
  }, []);

  const openModal = (movie) => {
    setSelectedSerie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSerie(null);
  };

  const handleDelete = async (serieId) => {
    try {
      const response = await fetch(`${API_URL}/series/${serieId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSeries(series.filter(m => m.id !== serieId));
        closeModal();
        alert("Serie excluído com sucesso!");
      } else {
        alert("Erro ao excluir o serie.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  function handleSearch(e) {
    setSearchTerm(e.target.value);
  }

  const filteredItems = series.filter(item =>
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
            placeholder='Pesquise Série'
            type="text"
          />
        </div>
      </div>

      <div className="itemPageContainer">
        {Array.isArray(series) && series.length > 0 ? (
          filteredItems.map((serie) => (
            <div key={serie.id} className="itemPageBox" onClick={() => openModal(serie)}>
              <div className="itemPageBoxImage">
                <img src={serie.image} alt={`Imagem do Filme ${serie.name}`} />
              </div>
              <div className="itemPageBoxInformation">
                <span><strong>{serie.name}</strong></span>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma Serie carregada.</p>
        )}
      </div>

      {/* Estrutura do Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Confirmar Exclusão</h2>
            <img className='imageDeleteModal' src={selectedSerie.image} alt="" />
            <p>Você tem certeza que deseja excluir a serie: <strong>{selectedSerie?.name}</strong>?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="btn-confirm" onClick={() => handleDelete(selectedSerie.id)}>Confirmar Exclusão</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteSeriePage;