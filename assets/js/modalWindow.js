
document.addEventListener("DOMContentLoaded", function() {
    const openModalBtn = document.getElementById("openModalBtn");
    const modal = document.getElementById("simulateModal");
    const closeModalIcons = modal.querySelectorAll(".close-modal, .close-modal-btn, .close-modal");
  
    // Abre o modal
    openModalBtn.addEventListener("click", function() {
      modal.style.display = "block";
    });
  
    // Fecha o modal ao clicar em qualquer elemento com a classe .close-modal ou .close-modal-btn
    closeModalIcons.forEach(elem => {
      elem.addEventListener("click", function() {
        modal.style.display = "none";
      });
    });
  
    // Fecha o modal ao clicar fora do conteúdo
    window.addEventListener("click", function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  
    // Exemplo: capturar clique em cada item de produto
    const productItems = modal.querySelectorAll(".prod-click-me");
    productItems.forEach(item => {
      item.addEventListener("click", function() {
        const productId = this.getAttribute("data-prod");
        console.log("Produto selecionado:", productId);
        // Fechar modal após seleção
        modal.style.display = "none";
        // Você pode disparar alguma função para lidar com o produto selecionado
      });
    });
  });
  