// popup.js
// Recuperar o valor salvo no armazenamento local
let titulo_aba = ''

chrome.storage.local.get(['title'], function(result) {
  // Adicionar o título da página ao elemento com o ID 'tit'
  document.getElementById("tit").innerText = "Título: " + result.title;

  titulo_aba = result.title
});

// Função para adicionar bloco ao popup
function adicionarBlocoAoPopup(content) {
  const btnLimparReqs = document.getElementById('rld');
btnLimparReqs.style.display = 'block'
  // Cria um elemento div para o novo bloco
  const block = document.createElement('div');
  block.className = 'requisicao-item'; // Adiciona uma classe para estilização opcional

  // Divide o conteúdo em linhas
  const lines = content.split('<div>');
  let url = ''; // Variável para armazenar a URL

  // Adiciona o conteúdo ao bloco
  lines.forEach(function (line, index) {
    if (index > 0) {
      // Cria um elemento div para cada linha
      const linhaElement = document.createElement('div');
      linhaElement.innerHTML = line.replace('</div>', ''); // Remove a tag de fechamento
      linhaElement.style.fontWeight = 'bold'; // Adiciona negrito às chaves

      // Adiciona estilos às chaves
      if (line.includes('Type:')) {
        linhaElement.style.color = 'blue';
        linhaElement.style.fontSize = '20px';
      } else if (line.includes('URL:')) {
        url = linhaElement; // Atualiza a variável 'url'
        linhaElement.style.color = 'green';
        linhaElement.style.fontSize = '18px';
      } else if (line.includes('Request Type:')) {
        linhaElement.style.color = 'red';
        linhaElement.style.fontSize = '16px';
      }

      // Adiciona a linha ao bloco
      block.appendChild(linhaElement);
    }
  });

  // Adiciona botão "Enviar"
  const botaoEnviar = document.createElement('button');
  botaoEnviar.textContent = 'Enviar';
  botaoEnviar.addEventListener('click', function () {
    sendServerP(url.textContent); // Envia a URL para a função sendServerP

    // Remove o bloco da requisição da DOM ao clicar em "Enviar"
    block.remove();
  });
  block.appendChild(botaoEnviar);

  // Adiciona estilos ao bloco
  block.style.border = '1px solid #ddd';
  block.style.padding = '10px';
  block.style.marginBottom = 'none';
  block.style.backgroundColor = '#f9f9f9';

  // Adiciona o bloco à div do popup
  document.getElementById('painel').appendChild(block);
}


// Função para exibir requisições salvas no painel
function exibirRequisicoesSalvas() {
  const btnLimparReqs = document.getElementById('rld');
btnLimparReqs.style.display = 'block'
  // Recupera os dados salvos no armazenamento local
  chrome.storage.local.get({ requisicoes: [] }, function (result) {
    const requisicoesSalvas = result.requisicoes;

    // Adiciona os blocos das requisições ao painel
    requisicoesSalvas.forEach(function (requisicao) {
      adicionarBlocoAoPopup(requisicao);
    });
  });
}

// Ativa o popup quando o usuário clica no ícone da extensão
document.addEventListener('DOMContentLoaded', function () {
  exibirRequisicoesSalvas();
});


function sendServerP(url,title) {
  // Cria uma conexão WebSocket
  const socket = new WebSocket('ws://127.0.0.1:1982');

  // Adiciona um ouvinte para o evento de abertura da conexão
  socket.addEventListener('open', (event) => {
    // Envia os dados como uma mensagem JSON
    socket.send(JSON.stringify({ url: url ,title:titulo_aba}));
  });

  // Adiciona um ouvinte para o evento de mensagem recebida
  socket.addEventListener('message', (event) => {
    // Faça o que quiser com a resposta do servidor (se houver)
    const data = JSON.parse(event.data);

  });

  // Adiciona um ouvinte para o evento de fechamento da conexão
  socket.addEventListener('close', (event) => {
  });

  // Adiciona um ouvinte para o evento de erro na conexão
  socket.addEventListener('error', (event) => {
    alert('Erro ao enviar os dados ao servidor. Certifique-se de que o servidor WebSocket está em execução.');
  });
}



// Função para remover todas as requisições do painel e limpar o armazenamento local
function removerReqs() {
  // Remove todos os elementos dentro da div do popup
  const painel = document.getElementById('painel');
  while (painel.firstChild) {
    painel.removeChild(painel.firstChild);
  }

  // Limpa os dados salvos no armazenamento local
  chrome.storage.local.set({ requisicoes: [] });
  const btnLimparReqs = document.getElementById('rld');
btnLimparReqs.style.display = 'none'
}

// Adiciona um evento ao botão "Limpar Requisições"
const btnLimparReqs = document.getElementById('rld');

btnLimparReqs.addEventListener('click', removerReqs);

