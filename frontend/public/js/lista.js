// lista.js - VERSÃO COM DEBUG DETALHADO
const API_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== PÁGINA CARREGADA ===');
    buscarUsuarios();
});

async function buscarUsuarios() {
    try {
        console.log('📡 Fazendo request para:', API_URL + '/users');
        
        const response = await fetch(API_URL + '/users');
        
        if (!response.ok) {
            throw new Error('Erro ' + response.status);
        }
        
        const data = await response.json();
        console.log('📦 Dados BRUTOS da API:', data);
        console.log('🔍 Tipo dos dados:', typeof data);
        
        exibirUsuarios(data);
        
    } catch (error) {
        console.error('❌ Erro ao buscar usuários:', error);
        mostrarErro('Erro: ' + error.message);
    }
}

function exibirUsuarios(dados) {
    const tbody = document.getElementById('lista-usuarios');
    
    if (!tbody) {
        console.error('❌ Elemento #lista-usuarios não encontrado!');
        return;
    }
    
    tbody.innerHTML = '';
    
    // IDENTIFICAR O FORMATO DOS DADOS
    console.log('=== ANALISANDO FORMATO DOS DADOS ===');
    
    let usuarios = [];
    let formato = '';
    
    if (Array.isArray(dados)) {
        usuarios = dados;
        formato = 'Array direto';
        console.log('✅ Formato: Array direto');
        
        if (dados.length > 0) {
            console.log('📝 Estrutura do primeiro item:', dados[0]);
            console.log('🔑 Chaves do primeiro item:', Object.keys(dados[0]));
        }
    } else if (typeof dados === 'object') {
        console.log('📄 É um objeto, verificando propriedades...');
        
        // Listar TODAS as propriedades do objeto
        console.log('🔑 Todas as chaves do objeto:', Object.keys(dados));
        
        for (let chave in dados) {
            console.log(`   "${chave}":`, dados[chave], 'tipo:', typeof dados[chave]);
            
            if (Array.isArray(dados[chave])) {
                console.log(`   → "${chave}" É UM ARRAY com ${dados[chave].length} itens`);
                usuarios = dados[chave];
                formato = `Objeto com array em "${chave}"`;
                
                if (dados[chave].length > 0) {
                    console.log(`   → Primeiro item de "${chave}":`, dados[chave][0]);
                    console.log(`   → Chaves do primeiro item:`, Object.keys(dados[chave][0]));
                }
                break;
            }
        }
    }
    
    console.log('👥 Usuários encontrados:', usuarios.length);
    console.log('📋 Formato identificado:', formato);
    
    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px; color: #666;">
                    Nenhum usuário encontrado.
                </td>
            </tr>
        `;
        return;
    }
    
    // CRIAR AS LINHAS DA TABELA
    usuarios.forEach(function(usuario, index) {
        console.log(`\n--- Processando usuário ${index + 1} ---`);
        console.log('Dados completos do usuário:', usuario);
        
        // Verificar TODAS as propriedades deste usuário
        console.log('Chaves deste usuário:', Object.keys(usuario));
        
        // Procurar por ID em QUALQUER propriedade (case insensitive)
        let idDoUsuario = null;
        let idPropriedade = null;
        
        for (let prop in usuario) {
            console.log(`   Propriedade "${prop}":`, usuario[prop]);
            
            // Verificar se parece ser um ID
            const propLower = prop.toLowerCase();
            if ((propLower === 'id' || propLower.includes('id')) && 
                (typeof usuario[prop] === 'number' || typeof usuario[prop] === 'string')) {
                idDoUsuario = usuario[prop];
                idPropriedade = prop;
                console.log(`   ✅ ENCONTRADO ID na propriedade "${prop}": ${idDoUsuario}`);
                break;
            }
        }
        
        // Se não encontrou ID, mostrar aviso
        if (idDoUsuario === null) {
            console.warn(`⚠️ ATENÇÃO: Usuário ${index + 1} não tem ID identificável!`);
            console.warn('Dados do usuário:', usuario);
        }
        
        // Criar a linha
        const linha = document.createElement('tr');
        
        // Colunas de dados
        const tdNome = document.createElement('td');
        tdNome.textContent = usuario.nome || usuario.Nome || 'Não informado';
        
        const tdEmail = document.createElement('td');
        tdEmail.textContent = usuario.email || usuario.Email || 'Não informado';
        
        const tdTelefone = document.createElement('td');
        tdTelefone.textContent = usuario.telefone || usuario.Telefone || usuario.phone || 'Não informado';
        
        // Coluna de ações (SÓ SE TIVER ID)
        const tdAcoes = document.createElement('td');
        tdAcoes.className = 'acoes';
        
        if (idDoUsuario !== null) {
            // Botão Editar
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn-editar';
            btnEditar.onclick = function() {
                console.log(`🚀 Clicou em EDITAR - ID: ${idDoUsuario} (da propriedade "${idPropriedade}")`);
                window.location.href = 'cadastro.html?userId=' + idDoUsuario;
            };
            
            // Botão Excluir
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn-excluir';
            btnExcluir.onclick = function() {
                console.log(`🗑️ Clicou em EXCLUIR - ID: ${idDoUsuario}`);
                if (confirm('Tem certeza?')) {
                    fetch(API_URL + '/users/' + idDoUsuario, { method: 'DELETE' })
                        .then(res => {
                            if (res.ok) {
                                alert('Excluído!');
                                buscarUsuarios();
                            }
                        });
                }
            };
            
            // Botão Listar Tarefas
            const btnTarefas = document.createElement('button');
            btnTarefas.textContent = 'Listar Tarefas';
            btnTarefas.className = 'btn-tarefas';
            btnTarefas.onclick = function() {
                console.log(`📋 Clicou em LISTAR TAREFAS - UserID: ${idDoUsuario}`);
                window.location.href = 'listatask.html?userId=' + idDoUsuario;
            };
            
            tdAcoes.appendChild(btnEditar);
            tdAcoes.appendChild(btnExcluir);
            tdAcoes.appendChild(btnTarefas);
        } else {
            tdAcoes.textContent = 'Sem ID';
        }
        
        // Adicionar células à linha
        linha.appendChild(tdNome);
        linha.appendChild(tdEmail);
        linha.appendChild(tdTelefone);
        linha.appendChild(tdAcoes);
        
        // Adicionar linha à tabela
        tbody.appendChild(linha);
        
        console.log(`✅ Linha ${index + 1} adicionada ${idDoUsuario ? 'com ID: ' + idDoUsuario : 'SEM ID'}`);
    });
    
    console.log('=== TABELA COMPLETA ===');
}

function mostrarErro(mensagem) {
    const tbody = document.getElementById('lista-usuarios');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: red; padding: 20px;">
                    ${mensagem}
                </td>
            </tr>
        `;
    }
}

// Para testar no console
window.debugAPI = function() {
    fetch(API_URL + '/users')
        .then(res => res.json())
        .then(data => {
            console.log('=== DEBUG COMPLETO ===');
            console.log('Resposta completa:', data);
            
            if (Array.isArray(data)) {
                console.log('Total de itens:', data.length);
                data.forEach((item, i) => {
                    console.log(`Item ${i}:`, item);
                    console.log(`   Chaves:`, Object.keys(item));
                    console.log(`   Tem "id"?`, 'id' in item);
                    console.log(`   Tem "Id"?`, 'Id' in item);
                    console.log(`   Tem "ID"?`, 'ID' in item);
                });
            }
        });
};