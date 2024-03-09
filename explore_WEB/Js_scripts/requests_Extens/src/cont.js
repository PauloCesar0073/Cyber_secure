// Função para realizar a requisição com base nos dados inseridos pelo usuário
function fazerRequisicao() {
  const host = document.getElementById('hostInput').value.trim();
  const tipoReq = document.getElementById('tipoReqInput').value;
  const dadosReq = document.getElementById('dadosReqInput').value;

  const url = host;
  const options = {
    method: tipoReq,
    body: tipoReq !== 'GET' ? dadosReq : undefined
  };

  fetch(url, options)
    .then(response => {
      document.getElementById('line').style.display = 'block';
      document.getElementById('btnCopiarHeaders').style.display = 'block';
      document.getElementById('codigoEstado').textContent = `Código de Estado: ${response.status}`;

      const headers = Array.from(response.headers.entries())
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      document.getElementById('cabecalhosRecebidos').textContent = headers;

      return response.text(); // Retorna a resposta como texto
    })
    .then(data => {
      document.getElementById('conteudoResposta').textContent = data;

      // Exibe a seção de resposta após receber a resposta da requisição
      document.getElementById('resposta').style.display = 'block';
      document.getElementById('btnCopiarResposta').style.display = 'block';
    })
    .catch(error => {
      document.getElementById('resposta').textContent = `Erro na requisição: ${error}`;

      // Exibe a seção de resposta mesmo em caso de erro
      document.getElementById('resposta').style.display = 'block';
    });
}

document.getElementById('reqbtn').addEventListener('click', fazerRequisicao);

// Função para copiar o conteúdo da resposta
function copiarResposta() {
  const conteudoResposta = document.getElementById('conteudoResposta').textContent;

  const textareaTemporaria = document.createElement('textarea');
  textareaTemporaria.value = conteudoResposta;

  document.body.appendChild(textareaTemporaria);
  textareaTemporaria.select();
  document.execCommand('copy');
  document.body.removeChild(textareaTemporaria);
  document.getElementById('btnCopiarResposta').textContent = "Copiado!";
  document.getElementById('btnCopiarResposta').disabled = true;
}

// Adiciona o evento de clique para copiar o conteúdo da resposta
document.getElementById('btnCopiarResposta').addEventListener('click', copiarResposta);

// Adiciona um ouvinte de evento ao botão para recarregar a página
document.getElementById('reload-btn').addEventListener('click', function () {
  location.reload();
});
// Função para copiar apenas os cabeçalhos recebidos
function copiarHeaders() {
  const cabecalhosRecebidos = document.getElementById('cabecalhosRecebidos').textContent;

  const textareaTemporaria = document.createElement('textarea');
  textareaTemporaria.value = cabecalhosRecebidos;

  document.body.appendChild(textareaTemporaria);
  textareaTemporaria.select();
  document.execCommand('copy');
  document.body.removeChild(textareaTemporaria);
  
  document.getElementById('btnCopiarHeaders').textContent = "Copiado!";
  document.getElementById('btnCopiarHeaders').disabled = true;
}

// Adiciona o evento de clique para copiar apenas os cabeçalhos recebidos
document.getElementById('btnCopiarHeaders').addEventListener('click', copiarHeaders);
