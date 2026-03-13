
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quoteForm');
    if (!form) return;
  
    // Defina a URL do endpoint (sua rota no Express)
    // const endpoint = 'http://localhost:3000/emailer/send';
    const endpoint = 'https://upsky-emailer.onrender.com/emailer/send';
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Impede o comportamento padrão do form
  
      // Captura elementos de feedback
      const loadingElem = form.querySelector('.loading');
      const errorElem = form.querySelector('.error-message');
      const sentElem = form.querySelector('.sent-message');
      const submitButton = form.querySelector('button[type="submit"]');

      // Disable button and show loading
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.style.display = 'none'; // Hide button
      }

      // Exibe 'Loading' e oculta erros/sucessos anteriores
      loadingElem.style.display = 'block';
      errorElem.style.display = 'none';
      sentElem.style.display = 'none';
  
      // Captura dados do formulário
      const formData = new FormData(form);

      try {
        // Faz requisição POST para o endpoint
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData, // Send FormData directly, not JSON
        });
  
        // Lê a resposta como JSON
        const result = await response.json();
  
        // Para de exibir 'Loading'
        loadingElem.style.display = 'none';
  
        if (response.ok) {
          // Sucesso: exibe mensagem de sucesso
          sentElem.style.display = 'block';
          // Update button text
          if (submitButton) {
            submitButton.textContent = 'Get a new quote';
            // Re-enable button
            submitButton.disabled = false;
            submitButton.disabled = false;
            submitButton.style.display = ''; // Show button
          }
          // Reseta o formulário
          form.reset();
          // Remove a mensagem após 5 segundos
          setTimeout(() => {
            sentElem.style.display = 'none';
          }, 6000);
        } else {
          // Exibe a mensagem de erro retornada pelo servidor
          errorElem.textContent = result.msg || 'Error sending request.';
          errorElem.style.display = 'block';
          if (submitButton) {
            submitButton.disabled = false; // Re-enable on error
            submitButton.style.display = ''; // Show button on error
          }
        }
      } catch (error) {
        // Erro de rede ou outro problema
        loadingElem.style.display = 'none';
        errorElem.textContent = 'Error server communication.';
        errorElem.style.display = 'block';
        if (submitButton) {
          submitButton.disabled = false; // Re-enable on error
          submitButton.style.display = ''; // Show button on error
        }
      }
  });
});

// Initialize Bootstrap tooltips
document.addEventListener('DOMContentLoaded', function() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});
