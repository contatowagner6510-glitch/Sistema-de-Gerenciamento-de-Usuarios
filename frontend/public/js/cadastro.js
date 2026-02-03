// cadastro.js - Com botão Voltar

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('Form');
    const titulo = document.querySelector('h1');
    
    // Pega ID da URL (se existir)
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('id');
    
    // Se tem ID, é edição
    if (usuarioId) {
        if (titulo) titulo.textContent = 'Editar Usuário';
        
        // Busca dados do usuário para preencher formulário
        fetch(`/lista/${usuarioId}`)
            .then(resposta => resposta.json())
            .then(resultado => {
                if (resultado.dados) {
                    const usuario = resultado.dados;
                    // Preenche campos
                    document.getElementById('Nome').value = usuario.nome || '';
                    document.getElementById('Email').value = usuario.email || '';
                    document.getElementById('Telefone').value = usuario.telefone || '';
                }
            })
            .catch(erro => {
                console.error('Erro:', erro);
                alert('Erro ao carregar dados');
            });
    }
    
    // === BOTÃO VOLTAR ===
    const btnVoltar = document.getElementById('btnVoltar');
    if (btnVoltar) {
        btnVoltar.onclick = function() {
            window.location.href = 'index.html';  // Volta para lista
        };
    }
    
   
    
    // Quando formulário é enviado
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Pega valores
        const telefone = document.getElementById('Telefone').value.trim();
        const nome = document.getElementById('Nome').value.trim();
        const email = document.getElementById('Email').value.trim();
        
        // Validação
        if (!telefone || !nome || !email) {
            alert("Preencha todos os campos!");
            return;
        }
        
        // Objeto usuário
        const usuario = { nome, email, telefone };
        
        try {
            // Define método: PUT para edição, POST para novo
            const url = usuarioId ? `/cadastro/${usuarioId}` : '/cadastro';
            const metodo = usuarioId ? 'PUT' : 'POST';
            
            // Envia para API
            const response = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });
            
            if (!response.ok) {
                throw new Error('Erro ao salvar');
            }
            
            // Sucesso
            const data = await response.json();
            alert(usuarioId ? 'Usuário atualizado!' : 'Usuário cadastrado!');
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar");
        }
    });
});