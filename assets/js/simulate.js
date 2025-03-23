document.addEventListener("DOMContentLoaded", function() {
  const openModalBtn = document.getElementById("openModalBtn");
  const modal = document.getElementById("simulateModal");
  const closeModalIcons = modal.querySelectorAll(".close-modal, .close-modal-btn");
  const selectedItemsContainer = document.getElementById("selectedItems");

  // Abre o modal
  openModalBtn.addEventListener("click", function() {
    modal.style.display = "block";
  });

  // Fecha o modal ao clicar no X ou botão Fechar
  closeModalIcons.forEach(elem => {
    elem.addEventListener("click", function() {
      modal.style.display = "none";
    });
  });

  // Fecha o modal ao clicar fora dele
  window.addEventListener("click", function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Captura clique nos itens de produto do modal
  const productItems = modal.querySelectorAll(".prod-click-me");
  productItems.forEach(item => {
    item.addEventListener("click", function() {
      const productId = this.getAttribute("data-prod-id");
      const productName = this.querySelector("h5")?.innerText || "Produto";
      const productImg = this.querySelector("img")?.src || ""; // Pega a URL da imagem

      // Cria o card dinamicamente
      addSelectedItem(productId, productName, productImg);

      // Fecha o modal
      modal.style.display = "none";
    });
  });

  function addSelectedItem(id, name, imgUrl) {
    // Cria container principal
    const card = document.createElement("div");
    card.classList.add("selected-item-card");

    // Botão para remover item
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.classList.add("remove-item-btn");
    removeBtn.textContent = "x";
    removeBtn.addEventListener("click", () => {
      selectedItemsContainer.removeChild(card);
    });
    card.appendChild(removeBtn);

    // ------------------------------------
    // Coluna Esquerda (Título + Imagem)
    // ------------------------------------
    const leftCol = document.createElement("div");
    leftCol.classList.add("item-left-col");

    const titleEl = document.createElement("h4");
    titleEl.textContent = name;
    leftCol.appendChild(titleEl);

    if (imgUrl) {
      const imageEl = document.createElement("img");
      imageEl.src = imgUrl;
      imageEl.alt = name;
      leftCol.appendChild(imageEl);
    }
    card.appendChild(leftCol);

    // ------------------------------------
    // Coluna Direita
    // ------------------------------------
    const rightCol = document.createElement("div");
    rightCol.classList.add("item-right-col");

    // 1) Bloco de Altura, Largura, Quantidade (snippet fornecido)
    const paramCol = document.createElement("div");
    paramCol.className = "col-xs-12 col-lg-2 no-padding-left each-selected-prod-inner-prod-parameters each-selected-prod-user-select-param";

    // Altura
    const alturaDiv = document.createElement("div");
    alturaDiv.className = "col-xs-12 no-padding overflow-hidden";
    alturaDiv.innerHTML = `
      <label>
        Altura
        <small>Min: 300 Max: 2200</small>
      </label>
      <input type="number" placeholder="Digitar altura em mm" value="1" class="form-control width-115">
    `;
    paramCol.appendChild(alturaDiv);

    // Largura
    const larguraDiv = document.createElement("div");
    larguraDiv.className = "col-xs-12 no-padding overflow-hidden";
    larguraDiv.innerHTML = `
      <label>
        Largura
        <small>Min: 300 Max: 1800</small>
      </label>
      <input type="number" placeholder="Digitar largura em mm" value="1" class="form-control width-115">
    `;
    paramCol.appendChild(larguraDiv);

    // Quantidade
    const qtyDiv = document.createElement("div");
    qtyDiv.className = "col-xs-7 no-padding overflow-hidden";
    qtyDiv.innerHTML = `
      <label>
        Quantidade
        <i class="fas"></i>
      </label>
      <input type="number" placeholder="Digitar quantidade" min="0" value="1" class="form-control width-115">
    `;
    paramCol.appendChild(qtyDiv);

    rightCol.appendChild(paramCol);

    // 2) Cor (radio)
    const colorDiv = document.createElement("div");
    colorDiv.classList.add("color-options");

    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Color:";
    colorDiv.appendChild(colorLabel);

    const colorRadios = document.createElement("div");
    colorRadios.classList.add("color-radios");

    // Radio White
    const labelWhite = document.createElement("label");
    const radioWhite = document.createElement("input");
    radioWhite.type = "radio";
    radioWhite.name = `color_${id}[]`;
    radioWhite.value = "white";
    radioWhite.checked = true;
    labelWhite.appendChild(radioWhite);
    labelWhite.appendChild(document.createTextNode(" White"));

    // Radio Other
    const labelOther = document.createElement("label");
    const radioOther = document.createElement("input");
    radioOther.type = "radio";
    radioOther.name = `color_${id}[]`;
    radioOther.value = "other";
    labelOther.appendChild(radioOther);
    labelOther.appendChild(document.createTextNode(" Other"));

    colorRadios.appendChild(labelWhite);
    colorRadios.appendChild(labelOther);
    colorDiv.appendChild(colorRadios);

    rightCol.appendChild(colorDiv);

    // 3) Blinds (checkbox e detalhes)
    const blindsDiv = document.createElement("div");
    blindsDiv.classList.add("blinds");

    // Checkbox
    const blindsLabel = document.createElement("label");
    const blindsCheckbox = document.createElement("input");
    blindsCheckbox.type = "checkbox";
    blindsCheckbox.classList.add("include-blinds");
    blindsLabel.appendChild(blindsCheckbox);
    blindsLabel.appendChild(document.createTextNode(" Include Blinds"));
    blindsDiv.appendChild(blindsLabel);

    // Blinds Details
    const blindsDetails = document.createElement("div");
    blindsDetails.classList.add("blinds-details");
    blindsDetails.style.display = "none";

    // Operation (Manual/Automatic)
    const operationLabel = document.createElement("label");
    operationLabel.textContent = "Operation:";

    const opManualLabel = document.createElement("label");
    const opManualRadio = document.createElement("input");
    opManualRadio.type = "radio";
    opManualRadio.name = `blindsOperation_${id}[]`;
    opManualRadio.value = "manual";
    opManualRadio.checked = true;
    opManualLabel.appendChild(opManualRadio);
    opManualLabel.appendChild(document.createTextNode(" Manual"));

    const opAutoLabel = document.createElement("label");
    const opAutoRadio = document.createElement("input");
    opAutoRadio.type = "radio";
    opAutoRadio.name = `blindsOperation_${id}[]`;
    opAutoRadio.value = "automatic";
    opAutoLabel.appendChild(opAutoRadio);
    opAutoLabel.appendChild(document.createTextNode(" Automatic"));

    // Agrupa Operation
    const operationDiv = document.createElement("div");
    operationDiv.style.marginTop = "8px";
    operationDiv.appendChild(operationLabel);
    operationDiv.appendChild(opManualLabel);
    operationDiv.appendChild(opAutoLabel);

    blindsDetails.appendChild(operationDiv);

    // Position (Interior/Exterior)
    const positionLabel = document.createElement("label");
    positionLabel.textContent = "Position:";

    const posIntLabel = document.createElement("label");
    const posIntRadio = document.createElement("input");
    posIntRadio.type = "radio";
    posIntRadio.name = `blindsPosition_${id}[]`;
    posIntRadio.value = "interior";
    posIntRadio.checked = true;
    posIntLabel.appendChild(posIntRadio);
    posIntLabel.appendChild(document.createTextNode(" Interior"));

    const posExtLabel = document.createElement("label");
    const posExtRadio = document.createElement("input");
    posExtRadio.type = "radio";
    posExtRadio.name = `blindsPosition_${id}[]`;
    posExtRadio.value = "exterior";
    posExtLabel.appendChild(posExtRadio);
    posExtLabel.appendChild(document.createTextNode(" Exterior"));

    const positionDiv = document.createElement("div");
    positionDiv.style.marginTop = "8px";
    positionDiv.appendChild(positionLabel);
    positionDiv.appendChild(posIntLabel);
    positionDiv.appendChild(posExtLabel);

    blindsDetails.appendChild(positionDiv);

    // Adiciona blindsDetails ao blindsDiv
    blindsDiv.appendChild(blindsDetails);

    // Mostra/oculta blindsDetails ao clicar no checkbox
    blindsCheckbox.addEventListener("change", function() {
      if (this.checked) {
        blindsDetails.style.display = "block";
      } else {
        blindsDetails.style.display = "none";
      }
    });

    rightCol.appendChild(blindsDiv);

    // Anexa a coluna direita ao card
    card.appendChild(rightCol);

    // Finalmente, insere o card no container
    selectedItemsContainer.appendChild(card);
  }
});
