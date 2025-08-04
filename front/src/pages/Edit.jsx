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

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser.id);

            fetch(`http://localhost:8080/api/users/${parsedUser.id}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Erro ao carregar dados do usuário');
                    }
                    return res.json();
                })
                .then(fullUser => {
                    console.log("Usuário completo:", fullUser);
                    setIsAuthenticated(true);
                    setIsAdmin(fullUser.role === 'ADMIN');
                    setName(fullUser.name || '');
                    setEmail(fullUser.email || '');
                    setCpf(fullUser.cpf || '');
                    
                    // Separar listas de favoritos por tipo
                    setFavoriteMovieList(fullUser.favoriteMovieList || []);
                    setFavoriteSeassonList(fullUser.favoriteSeassonList || []);
                })
                .catch(error => {
                    console.error('Erro ao carregar usuário:', error);
                    setMessage('Erro ao carregar dados do usuário');
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

    // Combinar listas de favoritos para exibição
    const allFavorites = [
        ...favoriteMovieList.map(item => ({...item, type: 'MOVIE'})),
        ...favoriteSeassonList.map(item => ({...item, type: 'SERIE'}))
    ];

    if (!isAuthenticated) {
        return (
            <div className="edit">
                <p>Carregando...</p>
            </div>
        );
    }

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
                                <i className="fa-solid fa-pen-to-square"></i>
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
                                <i className="fa-solid fa-pen-to-square"></i>
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
                                <i className="fa-solid fa-pen-to-square"></i>
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
                                <i className="fa-solid fa-pen-to-square"></i>
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
                    <div className="myListContainer">
                        <div className="boxMyList">
                            <h1>Minha Lista</h1>
                            <div className="favoritesGrid">
                                {allFavorites.map((item) => (
                                    <div key={`${item.type}-${item.id}`} className="favoriteContainer">
                                        {item.type === "MOVIE" && (
                                            <a href={`/movies/${item.id}`}>
                                                <img src={item.imageVertical || item.image} alt={item.name} />
                                                <div className="favoriteInfo">
                                                    <h3>{item.name}</h3>
                                                    <span className="favoriteType">Filme</span>
                                                </div>
                                            </a>
                                        )}
                                        {item.type === "SERIE" && (
                                            <a href={`/series/${item.serieId || item.id}`}>
                                                <img src={item.imageVertical || item.image} alt={item.name} />
                                                <div className="favoriteInfo">
                                                    <h3>{item.name}</h3>
                                                    <span className="favoriteType">Série</span>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Edit;