const imgs = document.querySelectorAll('.img');
const btn = document.querySelector('#change');
let intervalId = null;
let imageData = null; // Variável para armazenar os dados do JSON

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.addEventListener('load', () => {
      resolve(img);
    });
    img.addEventListener('error', () => {
      reject(new Error(`Não foi possível carregar a imagem ${src}`));
    });
  });
}

fetch("images.json")
  .then(response => response.json())
  .then(data => {
    imageData = data; // Armazena os dados do JSON na variável imageData
    const images = data.images;
    const promises = images.map(image => loadImage(image.src));

    Promise.all(promises).then(() => {
      btn.removeAttribute('disabled');
      loadRandomImages();
    });

    btn.addEventListener('click', () => {
      if (intervalId) {
        clearInterval(intervalId);
      }

      // Adiciona uma animação de intervalo entre os cliques
      btn.setAttribute('disabled', 'disabled');
      loadRandomImagesWithDelay(1000); // Tempo de intervalo entre os cliques (2000 milissegundos)
    });
  });

function loadRandomImages() {
  const randomIndices = getRandomIndices(imageData.images.length, imgs.length);

  imgs.forEach((img, index) => {
    const randomIndex = randomIndices[index];
    const url = imageData.images[randomIndex].src;
    const description = imageData.images[randomIndex].description;

    img.src = url;
    img.dataset.index = randomIndex; // Armazena o índice da imagem no atributo data-index
    img.nextElementSibling.querySelector('.modal-description').textContent = description;
  });
}

function loadRandomImagesWithDelay() {
  // Adiciona um atraso antes de carregar as novas imagens
  setTimeout(() => {
    loadRandomImages();
    btn.removeAttribute('disabled');
  }, 700);
}

function getRandomIndices(max, count) {
  const indices = [];
  while (indices.length < count) {
    const randomIndex = Math.floor(Math.random() * max);
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }
  return indices;
}

document.addEventListener('DOMContentLoaded', () => {
  const modals = document.querySelectorAll('.modal');
  const closeModals = document.querySelectorAll('.close');

  const openModal = function(image) {
    const modal = image.nextElementSibling;
    const modalImage = modal.querySelector('.modal-image');
    const modalDescription = modal.querySelector('.modal-description');
    const index = Number(image.dataset.index);
    const imageDataModal = imageData.images[index];

    modalImage.src = imageDataModal.src;
    modalDescription.textContent = imageDataModal.description;
    modal.classList.add('open');
  };

  const closeModal = function() {
    const modal = this.closest('.modal');
    modal.classList.remove('open');
  };

  imgs.forEach((image) => {
    image.addEventListener('click', () => openModal(image));
  });

  closeModals.forEach((span) => {
    span.addEventListener('click', closeModal);
  });
});
