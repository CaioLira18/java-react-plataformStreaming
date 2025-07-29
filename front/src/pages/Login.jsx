import React from 'react'
import Divider from '../components/Divider'

const Login = () => {
    return (
        <div>
            <div className="login">
                <div className="loginContainer">
                    <div className="imageLogin">
                        <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1753831910/logo2_gd2mwf.png" alt="" />
                    </div>
                    <div className="cabecalhoLogin">
                        <h1>Bem-vindo</h1>
                        <p>Preencha as informações para fazer login</p>
                    </div>
                    <div className="loginBox">
                        <div className="inputLogin">
                            <i class="fa-solid fa-envelope"></i>
                            <h1>Email</h1>
                            <input type="text" />
                        </div>
                        <div className="inputLogin">
                            <i class="fa-solid fa-lock"></i>
                            <h1>Senha</h1>
                            <input type="text" />
                        </div>
                        <Divider />
                        <div className="othersLogin">
                            <a href=""><i class="fa-brands fa-google"></i></a>
                            <a href=""><i class="fa-brands fa-facebook"></i></a>
                            <a href=""><i class="fa-brands fa-instagram"></i></a>
                        </div>
                        <div className="registerLink">
                            <a>Não tem conta ? <strong><a href="">Registre-se</a></strong></a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login
