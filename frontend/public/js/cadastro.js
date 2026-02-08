// cadastro.js
const API_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', async () => {
    // Configurar botão voltar
    const btnVoltar = document.getElementById('btnVoltar');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // Verificar se é uma edição (tem userId na URL)
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    
    if (userId) {
        // Modo edição: carregar dados do usuário
        await carregarUsuarioParaEdicao(userId);
        
        // Mudar o texto do botão para "Salvar Alterações"
        const btnCad = document.getElementById('BtnCad');
        if (btnCad) {
            btnCad.value = 'Salvar Alterações';
        }
    }
    
    // Configurar o envio do formulário
    const form = document.getElementById('Form');
    if (form) {
        form.addEventListener('submit', salvarUsuario);
    }
});

async function carregarUsuarioParaEdicao(id) {
    try {
        const resposta = await fetch(`${API_URL}/users/${id}`);
        
        if (!resposta.ok) {
            if (resposta.status === 404) {
                throw new Error(`Usuario com ID ${id} nao encontrado`);
            }
            throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
        }
        
        const dados = await resposta.json();
        
        // Extrair usuario do formato de resposta
        let usuario;
        
        if (dados && typeof dados === 'object') {
            // Verifica o formato da resposta
            if (dados.id || dados.nome || dados.email) {
                // Formato 1: Objeto usuario direto
                usuario = dados;
            } else if (dados.user && typeof dados.user === 'object') {
                // Formato 2: Propriedade "user"
                usuario = dados.user;
            } else if (dados.data && typeof dados.data === 'object') {
                // Formato 3: Propriedade "data"
                usuario = dados.data;
            } else {
                // Procura por qualquer propriedade que seja objeto com id ou nome
                for (const key in dados) {
                    if (dados[key] && typeof dados[key] === 'object' && 
                        (dados[key].id || dados[key].nome)) {
                        usuario = dados[key];
                        break;
                    }
                }
            }
        }
        
        if (!usuario) {
            usuario = dados; // Fallback
        }
        
        // Preencher os campos do formulário
        document.getElementById('Nome').value = usuario.nome || '';
        document.getElementById('Email').value = usuario.email || '';
        document.getElementById('Telefone').value = usuario.telefone || '';
        
    } catch (error) {
        console.error('Erro ao carregar usuario:', error);
        alert('Erro ao carregar dados do usuario para edicao: ' + error.message);
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

async function salvarUsuario(evento) {
    evento.preventDefault();
    
    const nome = document.getElementById('Nome').value.trim();
    const email = document.getElementById('Email').value.trim();
    const telefone = document.getElementById('Telefone').value.trim();
    
    if (!nome || !email) {
        alert('Nome e Email sao campos obrigatorios!');
        return;
    }
    
    const dadosUsuario = {
        nome: nome,
        email: email,
        telefone: telefone
    };
    
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    
    try {
        let resposta;
        
        if (userId) {
            // Modo edição: PUT
            resposta = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosUsuario)
            });
        } else {
            // Modo criação: POST
            resposta = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosUsuario)
            });
        }
        
        if (resposta.ok) {
            alert(userId ? 'Usuario atualizado com sucesso!' : 'Usuario cadastrado com sucesso!');
            window.location.href = 'index.html';
        } else {
            const erroTexto = await resposta.text();
            let mensagemErro = `Erro ${resposta.status}: ${resposta.statusText}`;
            
            try {
                const erroJson = JSON.parse(erroTexto);
                mensagemErro = erroJson.message || erroJson.error || mensagemErro;
            } catch (e) {
                // Não é JSON
            }
            
            throw new Error(mensagemErro);
        }
        
    } catch (error) {
        console.error('Erro ao salvar usuario:', error);
        alert('Erro ao salvar usuario: ' + error.message);
    }
}