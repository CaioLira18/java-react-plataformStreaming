import React from 'react';

const AdminPage = () => {

    return (
        <div className="adminPage">
            <div className="centerBox">
                {/*Adicionar Filmes*/}
                <div className="updateContainer">
                    <div className="updateBox">
                        <div className="updateBackground">
                            <img src="https://uploads.maisgoias.com.br/2022/05/f229a945-top-gun-maverick.jpg" alt="Filmes" />
                        </div>
                        <div className="updateContent">
                            <h1>Insira Filmes</h1>
                            <p>Adicionar Filmes</p>
                            <div className="buttonUpdate">
                                <a href="/adicionarconteudo">
                                    <button>Inserir</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Adicionar Series*/}
                <div className="updateContainer">
                    <div className="updateBox">
                        <div className="updateBackground">
                            <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764902884/tbbt_2_oshudg.jpg" alt="Series" />
                        </div>
                        <div className="updateContent">
                            <h1>Adicionar Series</h1>
                            <p>Adicionar Series</p>
                            <div className="buttonUpdate">
                                <a href="/adicionarconteudo">
                                    <button>Inserir</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Adicionar Temporadas*/}
                <div className="updateContainer">
                    <div className="updateBox">
                        <div className="updateBackground">
                            <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764903403/friends_c1jwhm.jpg" alt="Adicionar Temporadas" />
                        </div>
                        <div className="updateContent">
                            <h1>Adicionar Temporadas</h1>
                            <p>Adicionar Temporadas</p>
                            <div className="buttonUpdate">
                                <a href="/AdicionarTemporadas">
                                    <button>Inserir</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Deletar Filme*/}
                <div className="updateContainer">
                    <div className="updateBox">
                        <div className="updateBackground">
                            <img src="https://m.media-amazon.com/images/S/pv-target-images/bde8881567b130a785647cfa67c3a89c6583ebe6bee758ebf2129b89c7d6a9e8._SX1080_FMjpg_.jpg" alt="Coming Soon" />
                        </div>
                        <div className="updateContent">
                            <h1>Deletar Filmes</h1>
                            <p>Delete Filmes</p>
                            <div className="buttonUpdate">
                                <a href="/deleteMovie">
                                    <button>Deletar</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Deletar Serie*/}
                <div className="updateContainer">
                    <div className="updateBox">
                        <div className="updateBackground">
                            <img src="https://www.theglobeandmail.com/resizer/v2/G3AEAOIC7JFORNXCTNL4OGNQLQ.JPG?auth=48decce108a795a3de3e9c8d85bc615f3477e341f6fa79923de4b81827833be9&width=1200&quality=80" alt="Coming Soon" />
                        </div>
                        <div className="updateContent">
                            <h1>Delete Serie</h1>
                            <p>Delete Series</p>
                            <div className="buttonUpdate">
                                <a href="/deleteSerie">
                                    <button>Deletar</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Deletar Temporadas*/}
                <div className="updateContainer">
                    <div className="updateBox">
                        <div className="updateBackground">
                            <img src="https://m.media-amazon.com/images/S/pv-target-images/3e41d0768d4fe9bd835fad6807f1e431ac41a63a0afab7bddd62fe732c5e79d3._SX1080_FMjpg_.jpg" alt="Coming Soon" />
                        </div>
                        <div className="updateContent">
                            <h1>Deletar Temporadas</h1>
                            <p>Delete Temporadas</p>
                            <div className="buttonUpdate">
                                <a href="/deleteSeasson">
                                    <button>Deletar</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;