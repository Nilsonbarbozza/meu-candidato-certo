document.addEventListener('DOMContentLoaded', function () {
  const votarBotoes = document.querySelectorAll('.botao-votar'); // Seleciona todos os botões de votar

  // Verifica se o usuário pode votar com base no último voto
  const lastVoteTime = localStorage.getItem('lastVoteTime');
  const canVote = !lastVoteTime || (Date.now() - lastVoteTime > 3600000); // 1 hora = 3600000 ms

  if (!canVote) {
    disableVoteButtons();
  }

  // Adiciona evento de clique para cada botão de votar
  votarBotoes.forEach(botao => {
    botao.addEventListener('click', function () {
      if (!canVote) {
        alert('Você já votou recentemente. Tente novamente em 1 hora.');
        return;
      }

      // Captura o nome do candidato a partir do atributo 'name' do botão clicado
      const candidato = this.getAttribute('name'); // 'this' se refere ao botão clicado
      console.log("Voto capturado:", candidato);

      // Envia os dados para o Google Sheets via Google Apps Script
      enviarVoto(candidato);
      
      // Salva o tempo do voto atual e desabilita os botões
      localStorage.setItem('lastVoteTime', Date.now());
      disableVoteButtons();
    });
  });
});

// Função para desabilitar os botões de votar
function disableVoteButtons() {
  const votarBotoes = document.querySelectorAll('.botao-votar');
  votarBotoes.forEach(botao => {
    botao.disabled = true;
    botao.classList.add('botao-desativado'); // Adiciona a classe para mudar a cor
  });
}

// Função para enviar o voto ao Google Sheets usando Google Apps Script
function enviarVoto(candidato) {
  // URL do seu Google Apps Script configurado para receber os dados
  const scriptURL = "https://script.google.com/macros/s/AKfycbxtdYXPQ6HDb4o0H6Ex4SkwupDgepa7vqOPxEiNKJA3WVVtIL09hphqy94Dpr4K-IEg/exec";
  console.log("Voto enviado para Google Sheets:", candidato);

  // Cria os dados que serão enviados, neste caso o nome do candidato clicado
  const formData = new FormData();
  formData.append('candidato', candidato); // Envia o nome do candidato que foi capturado

  // Faz a requisição POST para o Google Apps Script
  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => response.text())
    .then(data => {
      alert('Voto registrado com sucesso!'); // Mensagem de sucesso
    })
    .catch(error => {
      console.error('Erro ao enviar voto:', error); // Mostra o erro no console se algo der errado
      alert('Erro ao registrar o voto. Tente novamente.'); // Mensagem de erro
    });
}
