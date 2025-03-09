document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('quoteForm');
    if (!form) return;
  
    // Defina a URL do endpoint (sua rota no Express)
    const endpoint = 'http://localhost:3000/contact/send-email';
  
    form.addEventListener('submit', async function (event) {
      event.preventDefault(); // Impede o comportamento padrão do form
  
      // Captura elementos de feedback
      const loadingElem = form.querySelector('.loading');
      const errorElem = form.querySelector('.error-message');
      const sentElem = form.querySelector('.sent-message');
  
      // Exibe 'Loading' e oculta erros/sucessos anteriores
      loadingElem.style.display = 'block';
      errorElem.style.display = 'none';
      sentElem.style.display = 'none';
  
      // Captura dados do formulário
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      try {
        // Faz requisição POST para o endpoint
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
  
        // Lê a resposta como JSON
        const result = await response.json();
  
        // Para de exibir 'Loading'
        loadingElem.style.display = 'none';
  
        if (response.ok) {
          // Sucesso: exibe mensagem de sucesso
          sentElem.style.display = 'block';
          // Reseta o formulário
          form.reset();
        } else {
          // Exibe a mensagem de erro retornada pelo servidor
          errorElem.textContent = result.msg || 'Erro ao enviar a solicitação.';
          errorElem.style.display = 'block';
        }
      } catch (error) {
        // Erro de rede ou outro problema
        loadingElem.style.display = 'none';
        errorElem.textContent = 'Erro na comunicação com o servidor.';
        errorElem.style.display = 'block';
      }
    });
  });
  