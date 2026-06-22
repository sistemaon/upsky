
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  
  // Defina a URL do endpoint (sua rota no Express)
  // const endpoint = 'http://localhost:3000/emailer/send';
  const endpoint = 'https://upsky-emailer.onrender.com/emailer/send';
  const optimisticSuccess = window.location.pathname.endsWith('get-a-quote.html');
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão do form
      
    // Captura elementos de feedback
    const loadingElem = form.querySelector('.loading');
    const errorElem = form.querySelector('.error-message');
    const sentElem = form.querySelector('.sent-message');
    const submitButton = form.querySelector('button[type="submit"]');

    const resetButton = () => {
      if (!submitButton) return;
      submitButton.textContent = 'Get a new quote';
      submitButton.disabled = false;
      submitButton.style.display = '';
    };

    const showError = (message) => {
      loadingElem.style.display = 'none';
      sentElem.style.display = 'none';
      errorElem.textContent = message;
      errorElem.style.display = 'block';
      resetButton();
    };

    const showSuccess = ({ resetForm = true } = {}) => {
      loadingElem.style.display = 'none';
      errorElem.style.display = 'none';
      sentElem.style.display = 'block';
      resetButton();
      if (resetForm) {
        form.reset();
      }
      setTimeout(() => {
        sentElem.style.display = 'none';
      }, 6000);
    };

    const snapshotForm = () => Array.from(form.elements)
      .filter((element) => element.name && element.type !== 'submit' && element.type !== 'button' && element.type !== 'reset')
      .map((element) => ({
        element,
        type: element.type,
        value: element.value,
        checked: element.checked,
        files: element.type === 'file' ? Array.from(element.files || []) : null,
      }));

    const restoreForm = (state) => {
      state.forEach((item) => {
        if (item.type === 'checkbox' || item.type === 'radio') {
          item.element.checked = item.checked;
          return;
        }

        if (item.type === 'file') {
          if (item.files && item.files.length && typeof DataTransfer !== 'undefined') {
            const dataTransfer = new DataTransfer();
            item.files.forEach((file) => dataTransfer.items.add(file));
            item.element.files = dataTransfer.files;
          } else {
            item.element.value = '';
          }
          return;
        }

        item.element.value = item.value;
      });
    };

    const readResponsePayload = async (response) => {
      const text = await response.text();
      if (!text) return null;

      try {
        return JSON.parse(text);
      } catch (parseError) {
        return text;
      }
    };

    const getErrorMessage = (response, payload) => {
      const defaultMessage = 'Error sending request.';

      if (!response.ok) {
        if (payload && typeof payload === 'object') {
          return payload.message || payload.msg || payload.error || defaultMessage;
        }

        if (typeof payload === 'string' && payload.trim()) {
          return payload;
        }

        return defaultMessage;
      }

      if (payload && typeof payload === 'object') {
        const explicitError = payload.success === false || payload.error || payload.errors;
        if (explicitError) {
          return payload.message || payload.msg || payload.error || defaultMessage;
        }
      }

      return null;
    };

    // Captura dados do formulário
    const formData = new FormData(form);

    if (optimisticSuccess) {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.style.display = 'none';
      }
      errorElem.style.display = 'none';
      sentElem.style.display = 'none';
      const formState = snapshotForm();

      // No Get a Quote page, acknowledge the submit immediately and let the
      // request finish in the background. Server-side errors still surface.
      try {
        const request = fetch(endpoint, {
          method: 'POST',
          body: formData, // Send FormData directly, not JSON
        });

        showSuccess();

        request
          .then(async (response) => {
            const payload = await readResponsePayload(response);
            const message = getErrorMessage(response, payload);

            if (message) {
              restoreForm(formState);
              showError(message);
            }
          })
          .catch(() => {
            restoreForm(formState);
            showError('Error server communication.');
          });
      } catch (error) {
        showError('Error server communication.');
      }
      return;
    }

    // Exibe 'Loading' e oculta erros/sucessos anteriores
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.style.display = 'none'; // Hide button
    }
    loadingElem.style.display = 'block';
    errorElem.style.display = 'none';
    sentElem.style.display = 'none';

    try {
      // Faz requisição POST para o endpoint
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData, // Send FormData directly, not JSON
      });

      // Lê a resposta do backend
      const result = await readResponsePayload(response);
      const message = getErrorMessage(response, result);

      // Para de exibir 'Loading'
      loadingElem.style.display = 'none';

      if (!message) {
        // Sucesso: exibe mensagem de sucesso
        showSuccess();
      } else {
        // Exibe a mensagem de erro retornada pelo servidor
        showError(message);
      }
    } catch (error) {
      // Erro de rede ou outro problema
      showError('Error server communication.');
    }
  });
});

// Initialize Bootstrap tooltips
document.addEventListener('DOMContentLoaded', function() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});
