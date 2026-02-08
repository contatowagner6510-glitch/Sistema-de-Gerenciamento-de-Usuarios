// cadastroTask.js - VERSÃO CORRIGIDA
const API_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Página de tarefas carregada');
    
    // Configurar botão voltar
    const btnVoltar = document.getElementById('btnVoltar');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', function() {
            const userId = obterUserIdDaURL();
            if (userId) {
                window.location.href = 'listatask.html?userId=' + userId;
            } else {
                window.location.href = 'index.html';
            }
        });
    }
    
    // Obter parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get('taskId');
    const userId = params.get('userId');
    
    console.log('Parâmetros da URL - taskId:', taskId, 'userId:', userId);
    
    // Validar userId
    if (!userId) {
        alert('Usuário não identificado! Voltando para lista de usuários.');
        window.location.href = 'index.html';
        return;
    }
    
    // Se for edição (tem taskId)
    if (taskId) {
        console.log('MODO EDIÇÃO - Carregando tarefa ID:', taskId);
        await carregarTarefaParaEdicao(taskId);
        
        // Mudar texto do botão
        const btnCad = document.getElementById('BtnCad');
        if (btnCad) {
            btnCad.value = 'Salvar Alterações';
        }
        
        // Mudar título da página
        const titulo = document.querySelector('h1');
        if (titulo) {
            titulo.textContent = 'Editar Tarefa';
        }
    } else {
        console.log('MODO CADASTRO - Nova tarefa para usuário:', userId);
    }
    
    // Configurar envio do formulário
    const form = document.getElementById('Form');
    if (form) {
        form.addEventListener('submit', function(evento) {
            evento.preventDefault();
            salvarTarefa(userId, taskId);
        });
    }
});

// Obter userId da URL
function obterUserIdDaURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('userId');
}

// Carregar tarefa para edição
async function carregarTarefaParaEdicao(taskId) {
    try {
        console.log('Fazendo request para:', API_URL + '/tasks/' + taskId);
        
        const resposta = await fetch(API_URL + '/tasks/' + taskId);
        
        console.log('Status da resposta:', resposta.status, resposta.statusText);
        
        if (!resposta.ok) {
            if (resposta.status === 404) {
                throw new Error('Tarefa não encontrada');
            }
            throw new Error('Erro ' + resposta.status + ': ' + resposta.statusText);
        }
        
        const dados = await resposta.json();
        console.log('Dados brutos da API:', dados);
        
        // Extrair tarefa do formato de resposta
        let tarefa = null;
        
        // Verificar diferentes formatos
        if (dados && typeof dados === 'object') {
            // Formato 1: Objeto direto da tarefa
            if (dados.id || dados.nome || dados.Nome) {
                tarefa = dados;
                console.log('Formato: Tarefa direta');
            }
            // Formato 2: Com propriedade "task"
            else if (dados.task && typeof dados.task === 'object') {
                tarefa = dados.task;
                console.log('Formato: Com propriedade "task"');
            }
            // Formato 3: Com propriedade "data"
            else if (dados.data && typeof dados.data === 'object') {
                tarefa = dados.data;
                console.log('Formato: Com propriedade "data"');
            }
            // Formato 4: Procurar por qualquer objeto que pareça tarefa
            else {
                for (const chave in dados) {
                    if (dados[chave] && typeof dados[chave] === 'object' && 
                        (dados[chave].id || dados[chave].nome || dados[chave].Nome)) {
                        tarefa = dados[chave];
                        console.log('Formato: Encontrado em propriedade "' + chave + '"');
                        break;
                    }
                }
            }
        }
        
        if (!tarefa) {
            console.warn('Não foi possível identificar o formato da tarefa, usando dados brutos');
            tarefa = dados;
        }
        
        console.log('Tarefa extraída:', tarefa);
        
        // Preencher campos do formulário
        const inputNome = document.getElementById('Nome');
        const textareaDescricao = document.getElementById('Descrição');
        const radioSim = document.getElementById('Sim');
        const radioNao = document.getElementById('Nao');
        const inputPrazo = document.getElementById('Prazo');
        
        if (inputNome) {
            inputNome.value = tarefa.nome || tarefa.Nome || '';
        }
        
        if (textareaDescricao) {
            textareaDescricao.value = tarefa.descricao || tarefa.Descricao || tarefa.descrição || '';
        }
        
        // Configurar radio buttons
        const concluida = tarefa.concluida || tarefa.Concluida || false;
        if (concluida === true || concluida === 'true' || concluida === 'SIM') {
            if (radioSim) radioSim.checked = true;
        } else {
            if (radioNao) radioNao.checked = true;
        }
        
        // Configurar data
        if (inputPrazo && (tarefa.prazo || tarefa.Prazo)) {
            const dataString = tarefa.prazo || tarefa.Prazo;
            const data = new Date(dataString);
            
            if (!isNaN(data.getTime())) {
                const ano = data.getFullYear();
                const mes = String(data.getMonth() + 1).padStart(2, '0');
                const dia = String(data.getDate()).padStart(2, '0');
                inputPrazo.value = `${ano}-${mes}-${dia}`;
                console.log('Data formatada:', inputPrazo.value);
            }
        }
        
        console.log('Formulário preenchido com sucesso');
        
    } catch (error) {
        console.error('Erro ao carregar tarefa:', error);
        alert('Erro ao carregar dados da tarefa: ' + error.message);
        
        // Voltar para lista de tarefas
        const userId = obterUserIdDaURL();
        if (userId) {
            setTimeout(function() {
                window.location.href = 'listatask.html?userId=' + userId;
            }, 2000);
        }
    }
}

// Salvar tarefa (criar ou editar)
async function salvarTarefa(userId, taskId) {
    // Obter valores do formulário
    const nome = document.getElementById('Nome').value.trim();
    const descricao = document.getElementById('Descrição').value.trim();
    
    const radioSim = document.getElementById('Sim');
    const concluida = radioSim ? radioSim.checked : false;
    
    const inputPrazo = document.getElementById('Prazo');
    const prazo = inputPrazo.value;
    
    // Validação
    if (!nome || !descricao) {
        alert('Nome e Descrição são campos obrigatórios!');
        return;
    }
    
    // Preparar dados
    const dadosTarefa = {
        nome: nome,
        descricao: descricao,
        concluida: concluida,
        userId: parseInt(userId)
    };
    
    if (prazo) {
        dadosTarefa.prazo = prazo;
    }
    
    console.log('Enviando tarefa:', dadosTarefa);
    console.log('taskId:', taskId ? 'Edição ID: ' + taskId : 'Novo cadastro');
    
    try {
        let url = API_URL + '/tasks';
        let metodo = 'POST';
        
        if (taskId) {
            url = API_URL + '/tasks/' + taskId;
            metodo = 'PUT';
        }
        
        console.log('Enviando ' + metodo + ' para:', url);
        
        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosTarefa)
        });
        
        console.log('Status da resposta:', resposta.status, resposta.statusText);
        
        if (resposta.ok) {
            const resultado = await resposta.json();
            console.log('Resposta da API:', resultado);
            
            alert(taskId ? 'Tarefa atualizada com sucesso!' : 'Tarefa cadastrada com sucesso!');
            window.location.href = 'listatask.html?userId=' + userId;
        } else {
            const erroTexto = await resposta.text();
            console.error('Erro da API:', erroTexto);
            
            let mensagemErro = 'Erro ' + resposta.status + ': ' + resposta.statusText;
            try {
                const erroJson = JSON.parse(erroTexto);
                mensagemErro = erroJson.message || erroJson.error || mensagemErro;
            } catch (e) {
                // Não é JSON
            }
            
            throw new Error(mensagemErro);
        }
        
    } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
        alert('Erro ao salvar tarefa: ' + error.message);
    }
}