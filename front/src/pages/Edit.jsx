import { useEffect, useState } from 'react';

const Edit = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [favoriteMovieList, setFavoriteMovieList] = useState([]);
  const [favoriteSerieList, setFavoriteSerieList] = useState([]);
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
          console.log('Dados completos do usuário:', fullUser); // DEBUG
          
          setIsAuthenticated(true);
          setIsAdmin(fullUser.role === 'ADMIN');
          setName(fullUser.name || '');
          setEmail(fullUser.email || '');
          setCpf(fullUser.cpf || '');
          setFavoriteMovieList(fullUser.favoriteMovieList || []);
          
          // CORREÇÃO: O backend está retornando favoriteSeassonList
          const seriesList = fullUser.favoriteSeassonList || [];
          console.log('Lista de temporadas favoritas:', seriesList); // DEBUG
          setFavoriteSerieList(seriesList);
        })
        .catch((error) => {
          console.error('Erro ao carregar dados:', error);
          setMessage('Erro ao carregar dados');
          setMessageType('error');
        });
    }
  }, []);

  const validateForm = () => {
        if (!name.trim()) {
            setMessage('Nome é obrigatório');
            setMessageType('error');
            return false;
        }

        if (!email.trim()) {
            setMessage('Email é obrigatório');
            setMessageType('error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Email inválido');
            setMessageType('error');
            return false;
        }

        if (cpf && cpf.replace(/\D/g, '').length !== 11) {
            setMessage('CPF deve conter 11 dígitos');
            setMessageType('error');
            return false;
        }

        if (newPassword) {
            if (!currentPassword) {
                setMessage('Senha atual é obrigatória para alterar a senha');
                setMessageType('error');
                return false;
            }

            if (newPassword.length < 6) {
                setMessage('Nova senha deve ter pelo menos 6 caracteres');
                setMessageType('error');
                return false;
            }

            if (newPassword !== confirmPassword) {
                setMessage('Nova senha e confirmação não coincidem');
                setMessageType('error');
                return false;
            }
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setMessage('');

        try {
            const updateData = {
                name: name.trim(),
                email: email.trim(),
                cpf: cpf.replace(/\D/g, ''),
            };

            if (newPassword) {
                updateData.password = newPassword;
            }

            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Usuário não encontrado');
                } else if (response.status === 400) {
                    throw new Error('Dados inválidos');
                } else {
                    throw new Error('Erro ao atualizar usuário');
                }
            }

            const updatedUser = await response.json();

            const storedUser = JSON.parse(localStorage.getItem("user"));
            const updatedStoredUser = {
                ...storedUser,
                name: updatedUser.name,
                email: updatedUser.email
            };
            localStorage.setItem("user", JSON.stringify(updatedStoredUser));

            setMessage('Informações atualizadas com sucesso!');
            setMessageType('success');

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            setMessage(error.message || 'Erro ao atualizar informações');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const formatCPF = (value) => {
        const cpf = value.replace(/\D/g, '');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const handleCPFChange = (e) => {
        const formattedCPF = formatCPF(e.target.value);
        setCpf(formattedCPF);
    };

  const handleRemoveToFavorites = async (item) => {
    if (!userId) return alert('Você precisa estar logado.');

    // CORREÇÃO: Usar a rota correta baseada no que realmente existe no backend
    const url = item.type === 'MOVIE'
      ? `http://localhost:8080/api/users/${userId}/favorites/${item.id}`
      : `http://localhost:8080/api/users/${userId}/favorites-seasson/${item.id}`; // Use a rota que existe

    console.log('URL de remoção:', url); // DEBUG

    try {
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar');

      if (item.type === 'MOVIE')
        setFavoriteMovieList((prev) => prev.filter((m) => m.id !== item.id));
      else
        setFavoriteSerieList((prev) => prev.filter((s) => s.id !== item.id));

      // Fechar o menu após remover
      setMenuOpenId(null);
      alert('Removido da lista!');
    } catch (err) {
      console.error(err);
      alert('Erro ao remover');
    }
  };

  // Criar uma chave única para cada item
  const allFavorites = [
    ...favoriteMovieList.map((item) => ({ 
      ...item, 
      id: item.id || item.movieId, 
      type: 'MOVIE',
      uniqueKey: `movie-${item.id || item.movieId}` 
    })),
    ...favoriteSerieList.map((item) => {
      console.log('Item da temporada:', item); // DEBUG
      return {
        ...item, 
        id: item.id, // Usar o ID da temporada
        type: 'SERIE',
        uniqueKey: `seasson-${item.id}`, // Usar prefixo seasson para diferenciar
        // Garantir que tem nome para exibir - usar o nome da temporada
        name: item.name || 'Temporada sem nome'
      };
    }),
  ];

  console.log('All favorites:', allFavorites); // DEBUG

  // Função para fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menuButton') && !event.target.closest('.dropdownMenu')) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!isAuthenticated) return <p>Carregando...</p>;

  return (
    <div>
      <div className="edit">
        <h1>Editar Informações</h1>
        <div className="editContainer">
                    <div className="editBox">
                        <div className="inputEdit">
                            <h2>Nome</h2>
                            <div className="iconEdit">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Digite seu nome"
                                />
                                <i class="fa-solid fa-user"></i>
                            </div>
                        </div>

                        <div className="inputEdit">
                            <h2>Email</h2>
                            <div className="iconEdit">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Digite seu email"
                                />
                                <i class="fa-solid fa-envelope"></i>
                            </div>
                        </div>

                        <div className="inputEdit">
                            <h2>CPF</h2>
                            <div className="iconEdit">
                                <input
                                    type="text"
                                    value={cpf}
                                    onChange={handleCPFChange}
                                    placeholder="000.000.000-00"
                                    maxLength="14"
                                />
                                <i className="fa-solid fa-id-card"></i>
                            </div>
                        </div>

                        <div className="inputEdit">
                            <h2>Senha Atual</h2>
                            <div className="iconEdit">
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Digite sua senha atual"
                                />
                                <i className="fa-solid fa-lock"></i>
                            </div>
                        </div>

                        <div className="inputEdit">
                            <h2>Nova Senha</h2>
                            <div className="iconEdit">
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Digite a nova senha"
                                />
                                <i class="fa-solid fa-lock"></i>
                            </div>
                        </div>

                        <div className="inputEdit">
                            <h2>Confirmar Nova Senha</h2>
                            <div className="iconEdit">
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirme a nova senha"
                                />
                                <i class="fa-solid fa-lock"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="editAddContainer">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        style={{
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Salvando...' : 'Salvar Informações'}
                    </button>
                </div>

                {message && (
                    <div className={`message ${messageType}`}>
                        {message}
                    </div>
                )}
      </div>

      {allFavorites.length > 0 && (
        <div className="myList">
          <div className="boxMyList">
            <h1>Minha Lista</h1>
            <div className="favoritesGrid">
              {allFavorites.map((item) => (
                <div key={item.uniqueKey} className="favoriteContainer">
                  <img src={item.imageVertical || item.image} alt={item.name} className="favoriteImage" />

                  <div className="menuButton">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(prev => prev === item.uniqueKey ? null : item.uniqueKey);
                      }}
                    >
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                  </div>

                  {menuOpenId === item.uniqueKey && (
                    <div className="dropdownMenu">
                      <button onClick={() => handleRemoveToFavorites(item)}>
                        <i className="fa-solid fa-trash"></i> Remover
                      </button>
                    </div>
                  )}

                  <a className="favoriteLink" href={item.type === 'MOVIE' ? `/movies/${item.id}` : `/series/${item.id}`}></a>
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