import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Edit = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [photo, setPhoto] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);
  const API_URL = "https://java-react-plataformstreaming.onrender.com/api";
  // const API_URL = "http://localhost:8080/api";
  const navigate = useNavigate();
  {isAuthenticated && (
    navigate('/login')
  )}


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);

      fetch(`${API_URL}/users/${parsedUser.id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Erro ao carregar dados');
          return res.json();
        })
        .then((fullUser) => {
          setIsAuthenticated(true);
          setName(fullUser.name || '');
          setEmail(fullUser.email || '');
          setCpf(fullUser.cpf || '');
          setPhoto(fullUser.photo || '');
          setPhotoPreview(fullUser.photo || '');
        })
        .catch((error) => {
          console.error('Erro ao carregar dados:', error);
          setMessage('Erro ao carregar dados do usuário');
          setMessageType('error');
        });
    }
  }, []);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Imagem muito grande. Máximo 5MB');
        setMessageType('error');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setMessage('Arquivo deve ser uma imagem');
        setMessageType('error');
        return;
      }

      setPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setMessage('');
    }
  };

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

  const uploadProfileImageToCloudinary = async () => {
    if (!photoFile) return photo;

    const formData = new FormData();
    formData.append("file", photoFile);
    formData.append("upload_preset", "profile_users");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    if (!response.ok) throw new Error('Erro ao fazer upload da imagem');

    const data = await response.json();
    return data.secure_url;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      let uploadedImageProfile = photo;
      if (photoFile) {
        uploadedImageProfile = await uploadProfileImageToCloudinary();
      }

      // Construção do objeto garantindo tipos simples
      const updateData = {
        name: name.trim(),
        email: email.trim(),
        cpf: cpf.replace(/\D/g, ''),
        photo: uploadedImageProfile
      };

      // Só envia a senha se o usuário digitou uma nova
      if (newPassword && newPassword.trim().length >= 6) {
        updateData.password = newPassword;
      }

      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json' // O Spring exige isso para @RequestBody
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || 'Erro ao atualizar');
      }

      const updatedUser = await response.json();

      // Atualiza o LocalStorage com os novos dados
      const storedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        name: updatedUser.name,
        email: updatedUser.email,
        photo: updatedUser.photo
      }));

      setPhoto(updatedUser.photo);
      setPhotoPreview(updatedUser.photo);
      setMessage('Informações atualizadas com sucesso!');
      setMessageType('success');

      // Limpa campos de senha
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value) => {
    const cpf = value.replace(/\D/g, '');
    if (cpf.length <= 11) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setCpf(formattedCPF);
  };

  if (!isAuthenticated) {
    return (
      <div className="loading">
        <div className="loadingText">
          <p>Carregando Conteúdo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editProfilePage">
      <div className="editProfileContainer">
        <div className="editProfileBox">
          <h1 className="editProfileTitle">Editar Perfil</h1>

          <div className="profilePhotoSection">
            <div className="profilePhotoWrapper" onClick={handlePhotoClick}>
              <img
                src={photoPreview || "https://res.cloudinary.com/dthgw4q5d/image/upload/v1753994647/icon_fzzpew.png"}
                alt="Foto de Perfil"
                className="profilePhoto"
              />
              <div className="profilePhotoOverlay">
                <i className="fa-solid fa-camera"></i>
                <span>Alterar Foto</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            {photoFile && (
              <p className="photoSelectedText">
                <i className="fa-solid fa-check-circle"></i> Foto selecionada
              </p>
            )}
          </div>

          <div className="editFormGrid">
            <div className="inputGroup">
              <label>Nome</label>
              <div className="inputWithIcon">
                <i className="fa-solid fa-user"></i>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label>Email</label>
              <div className="inputWithIcon">
                <i className="fa-solid fa-envelope"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label>CPF</label>
              <div className="inputWithIcon">
                <i className="fa-solid fa-id-card"></i>
                <input
                  type="text"
                  value={cpf}
                  onChange={handleCPFChange}
                  placeholder="000.000.000-00"
                  maxLength="14"
                />
              </div>
            </div>

            <div className="inputGroup fullWidth">
              <label>Senha Atual</label>
              <div className="inputWithIcon">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label>Nova Senha</label>
              <div className="inputWithIcon">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label>Confirmar Nova Senha</label>
              <div className="inputWithIcon">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a nova senha"
                />
              </div>
            </div>
          </div>

          <button
            className="saveButton"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Salvando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-check"></i>
                Salvar Alterações
              </>
            )}
          </button>

          {message && (
            <div className={`feedbackMessage ${messageType}`}>
              <i className={`fa-solid ${messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Edit;

