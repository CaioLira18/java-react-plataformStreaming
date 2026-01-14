import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DeleteSeassonPage = () => {
  const [name, setName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [series, setSeries] = useState([]);
  const [seassons, setSeassons] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [selectedSeasson, setSelectedSeasson] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = "http://localhost:8080/api";
  const navigate = useNavigate();

  /* ================= AUTH ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetch(`${API_URL}/users/${parsedUser.id}`)
        .then(res => res.json())
        .then(fullUser => {
          setName(fullUser.name || '');
          setIsAuthenticated(true);
        })
        .catch(() => navigate("/login"));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  /* ================= SERIES ================= */
  useEffect(() => {
    fetch(`${API_URL}/series`)
      .then(res => res.json())
      .then(data => setSeries(data.content || []))
      .catch(() => setSeries([]));
  }, []);

  /* ================= SEASSONS ================= */
  useEffect(() => {
    fetch(`${API_URL}/seassons`)
      .then(res => res.json())
      .then(data => setSeassons(data.content || []))
      .catch(() => setSeassons([]));
  }, []);

  /* ================= MODAL ================= */
  const openModal = (serie) => {
    setSelectedSerie(serie);
    setSelectedSeasson(null);

    fetch(`${API_URL}/seassons/series/${serie.id}`)
      .then(res => res.json())
      .then(data => {
        setSeassons(data);
      })
      .catch(() => setSeassons([]));

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSerie(null);
    setSelectedSeasson(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (seassonId) => {
    if (!selectedSeasson) return;

    try {
      const response = await fetch(
        `${API_URL}/seassons/${seassonId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setSeassons(prev =>
          prev.filter(s => s.id !== seassonId)
        );
        closeModal();
        alert("Temporada excluída com sucesso!");
      } else {
        alert("Erro ao excluir a Temporada.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  /* ================= FILTERS ================= */
  const filteredItems = series.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filtredSeassons = seassons.filter(
    item => item.series?.id === selectedSerie?.id
  );


  /* ================= RENDER ================= */
  return (
    <div className="deletePage">
      <div className="searchInput">
        <div className="boxSearchInput">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Pesquise Série'
            type="text"
          />
        </div>
      </div>

      <div className="itemPageContainer">
        {filteredItems.length > 0 ? (
          filteredItems.map((serie) => (
            <div
              key={serie.id}
              className="itemPageBox"
              onClick={() => openModal(serie)}
            >
              <div className="itemPageBoxImage">
                <img src={serie.image} alt={serie.name} />
              </div>
              <div className="itemPageBoxInformation">
                <strong>{serie.name}</strong>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma Série carregada.</p>
        )}
      </div>

      {isModalOpen && selectedSerie && (
        <div className="modal-overlay">
          <div className="modal-container">
            <img
              className="imageDeleteModal"
              src={selectedSerie.image}
              alt={selectedSerie.name}
            />

            <h2>Confirmar Exclusão</h2>

            <select
              value={selectedSeasson?.id || ""}
              onChange={(e) =>
                setSelectedSeasson(
                  filtredSeassons.find(
                    s => String(s.id) === e.target.value
                  )
                )
              }
            >
              <option value="">Selecione a Temporada</option>
              {filtredSeassons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>
                Cancelar
              </button>
              <button
                disabled={!selectedSeasson}
                onClick={() => handleDelete(selectedSeasson.id)}
              >
                Deletar Temporada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteSeassonPage;
