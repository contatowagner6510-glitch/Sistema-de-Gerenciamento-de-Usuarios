// listatask.js - COM NOME DO USUÁRIO
const API_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', function() {
    console.log('LISTA DE TAREFAS CARREGADA');
    
    const btnNovo = document.getElementById('btnNovo');
    if (btnNovo) {
        btnNovo.addEventListener('click', function() {
            const userId = obterUserIdDaURL();
            if (userId) {
                window.location.href = 'cadastrotask.html?userId=' + userId;
            }
        });
    }
    
    carregarTarefas();
});

function obterUserIdDaURL() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    
    if (!userId) {
        alert('Usuário não identificado! Voltando para lista de usuários.');
        window.location.href = 'index.html';
        return null;
    }
    
    console.log('UserId da URL:', userId);
    return userId;
}

// Buscar dados do usuário pelo ID
async function buscarUsuarioPorId(userId) {
    try {
        console.log('Buscando dados do usuário ID:', userId);
        
        const response = await fetch(API_URL + '/users/' + userId);
        
        if (!response.ok) {
            console.warn('Não foi possível buscar dados do usuário');
            return null;
        }
        
        const dados = await response.json();
        console.log('Dados do usuário:', dados);
        
        // Extrair o objeto usuário
        let usuario = null;
        
        if (dados && typeof dados === 'object') {
            if (dados.id || dados.nome) {
                usuario = dados;
            } else if (dados.user && typeof dados.user === 'object') {
                usuario = dados.user;
            } else if (dados.data && typeof dados.data === 'object') {
                usuario = dados.data;
            } else {
                for (const chave in dados) {
                    if (dados[chave] && typeof dados[chave] === 'object' && 
                        (dados[chave].id || dados[chave].nome)) {
                        usuario = dados[chave];
                        break;
                    }
                }
            }
        }
        
        return usuario;
        
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return null;
    }
}

async function carregarTarefas() {
    const userId = obterUserIdDaURL();
    if (!userId) return;
    
    try {
        // Buscar dados do usuário primeiro
        const usuario = await buscarUsuarioPorId(userId);
        const nomeUsuario = usuario ? (usuario.nome || 'Desconhecido') : 'Usuário ' + userId;
        
        console.log('Nome do usuário:', nomeUsuario);
        
        console.log('Buscando tarefas do usuário ' + userId + '...');
        
        const response = await fetch(API_URL + '/tasks/user/' + userId);
        
        console.log('Status:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error('Erro ' + response.status + ': ' + response.statusText);
        }
        
        const dados = await response.json();
        console.log('Dados das tarefas:', dados);
        
        // Passar o nome do usuário para a função de exibição
        exibirTarefas(dados, userId, nomeUsuario);
        
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        mostrarErro('Erro ao carregar tarefas: ' + error.message);
    }
}

function exibirTarefas(dados, userId, nomeUsuario) {
    const tbody = document.getElementById('lista-tarefas');
    
    if (!tbody) {
        console.error('Elemento #lista-tarefas não encontrado!');
        return;
    }
    
    tbody.innerHTML = '';
    
    // Atualizar título da página com o NOME do usuário
    const titulo = document.querySelector('h1');
    if (titulo) {
        titulo.textContent = 'Lista de Tarefas do usuário: ' + nomeUsuario;
    }
    
    let tarefas = [];
    
    if (Array.isArray(dados)) {
        tarefas = dados;
        console.log('Formato: Array direto com ' + tarefas.length + ' tarefas');
    } else if (typeof dados === 'object') {
        for (let chave in dados) {
            if (Array.isArray(dados[chave])) {
                tarefas = dados[chave];
                console.log('Encontrado array em "' + chave + '" com ' + tarefas.length + ' itens');
                break;
            }
        }
    }
    
    if (tarefas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px;">
                    ${nomeUsuario} não tem tarefas cadastradas.
                </td>
            </tr>
        `;
        return;
    }
    
    tarefas.forEach(function(tarefa) {
        const linha = document.createElement('tr');
        
        const tdNome = document.createElement('td');
        tdNome.textContent = tarefa.nome || tarefa.Nome || 'Sem nome';
        
        const tdDescricao = document.createElement('td');
        tdDescricao.textContent = tarefa.descricao || tarefa.Descricao || tarefa.descrição || 'Sem descrição';
        
        const tdConcluida = document.createElement('td');
        const concluida = tarefa.concluida || tarefa.Concluida || false;
        tdConcluida.textContent = concluida ? 'Sim' : 'Não';
        
        const tdPrazo = document.createElement('td');
        if (tarefa.prazo || tarefa.Prazo) {
            const data = new Date(tarefa.prazo || tarefa.Prazo);
            tdPrazo.textContent = data.toLocaleDateString('pt-BR');
        } else {
            tdPrazo.textContent = 'Sem prazo';
        }
        
        const tdAcoes = document.createElement('td');
        tdAcoes.className = 'acoes';
        
        let tarefaId = null;
        
        for (let prop in tarefa) {
            const propLower = prop.toLowerCase();
            if ((propLower === 'id' || propLower.includes('id')) && 
                (typeof tarefa[prop] === 'number' || typeof tarefa[prop] === 'string')) {
                tarefaId = tarefa[prop];
                console.log('ID da tarefa: ' + tarefaId + ' (propriedade "' + prop + '")');
                break;
            }
        }
        
        if (tarefaId !== null) {
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn-editar';
            btnEditar.onclick = function() {
                editarTarefa(tarefaId, userId);
            };
            
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn-excluir';
            btnExcluir.onclick = function() {
                excluirTarefa(tarefaId);
            };
            
            tdAcoes.appendChild(btnEditar);
            tdAcoes.appendChild(btnExcluir);
            
        } else {
            tdAcoes.textContent = 'Sem ID';
        }
        
        linha.appendChild(tdNome);
        linha.appendChild(tdDescricao);
        linha.appendChild(tdConcluida);
        linha.appendChild(tdPrazo);
        linha.appendChild(tdAcoes);
        
        tbody.appendChild(linha);
    });
}

function editarTarefa(tarefaId, userId) {
    console.log('Editando tarefa ID:', tarefaId, 'do usuário:', userId);
    window.location.href = 'cadastrotask.html?taskId=' + tarefaId + '&userId=' + userId;
}

async function excluirTarefa(tarefaId) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
        return;
    }
    
    try {
        console.log('Excluindo tarefa ID:', tarefaId);
        
        const response = await fetch(API_URL + '/tasks/' + tarefaId, {
            method: 'DELETE'
        });
        
        console.log('Status da exclusão:', response.status, response.statusText);
        
        if (response.ok) {
            alert('Tarefa excluída com sucesso!');
            carregarTarefas();
        } else {
            throw new Error('Erro ' + response.status + ': ' + response.statusText);
        }
        
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        alert('Erro ao excluir tarefa: ' + error.message);
    }
}

function mostrarErro(mensagem) {
    const tbody = document.getElementById('lista-tarefas');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: red; padding: 20px;">
                    ${mensagem}
                </td>
            </tr>
        `;
    }
}