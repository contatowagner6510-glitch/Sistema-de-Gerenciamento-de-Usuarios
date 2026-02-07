// lista.js - Gerencia lista de usuários

// Aguarda página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da página
    const tbody = document.getElementById('lista-usuarios');
    const btnRecarregar = document.getElementById('btnRecarregar');
    
    // Busca usuários da API
    function carregarUsuarios() {
        fetch('/users')  // Chama rota GET /lista
            .then(resposta => resposta.json())  // Converte resposta para JSON
            .then(resultado => {
                tbody.innerHTML = '';  // Limpa tabela
                
                // Se não tiver dados
                if (!resultado.dados || resultado.dados.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4">Nenhum usuário</td></tr>';
                    return;
                }
                
                // Para cada usuário, cria linha na tabela
                resultado.dados.forEach(usuario => {
                    const linha = document.createElement('tr');
                    
                    // Coluna Nome
                    const tdNome = document.createElement('td');
                    tdNome.textContent = usuario.nome;
                    linha.appendChild(tdNome);
                    
                    // Coluna Email
                    const tdEmail = document.createElement('td');
                    tdEmail.textContent = usuario.email;
                    linha.appendChild(tdEmail);
                    
                    // Coluna Telefone
                    const tdTelefone = document.createElement('td');
                    tdTelefone.textContent = usuario.telefone;
                    linha.appendChild(tdTelefone);
                    
                    // Coluna Ações
                    const tdAcoes = document.createElement('td');
                    
                    // Botão Editar - vai para cadastro com ID
                    const btnEditar = document.createElement('button');
                    btnEditar.textContent = 'Editar';
                    btnEditar.onclick = () => window.location.href = `cadastro.html?id=${usuario.userId}`;
                    tdAcoes.appendChild(btnEditar);
                    
                    // Botão Excluir - chama função de exclusão
                    const btnExcluir = document.createElement('button');
                    btnExcluir.textContent = 'Excluir';
                    btnExcluir.onclick = () => excluirUsuario(usuario.userId, linha);
                    tdAcoes.appendChild(btnExcluir);
                    
                    linha.appendChild(tdAcoes);
                    tbody.appendChild(linha);  // Adiciona linha à tabela
                });
            })
            .catch(erro => {
                console.error('Erro:', erro);
                tbody.innerHTML = '<tr><td colspan="4">Erro ao carregar</td></tr>';
            });
    }
    
    // Exclui usuário via API DELETE
    function excluirUsuario(id, linha) {
        if (confirm('Excluir este usuário?')) {
            fetch(`/users/${id}`, {  // Chama rota DELETE
                method: 'DELETE'
            })
            .then(resposta => resposta.json())
            .then(() => {
                linha.remove();  // Remove linha da tabela
                
                // Se tabela ficou vazia
                if (tbody.children.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4">Nenhum usuário</td></tr>';
                }
            })
            .catch(erro => {
                console.error('Erro:', erro);
                alert('Erro ao excluir');
            });
        }
    }
    
    // Configura botão recarregar
    if (btnRecarregar) {
        btnRecarregar.onclick = carregarUsuarios;
    }
    
    // Carrega usuários ao iniciar
    carregarUsuarios();
});