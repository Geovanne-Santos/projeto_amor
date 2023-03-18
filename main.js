let imgs = document.querySelectorAll('img')

let btn = document.querySelector('#change')

fetch("images.json")
  .then(response => response.json())
  .then(data => {
    const images = data.images;
    const promises = [];

    // cria uma promessa para cada imagem que precisa ser pré-carregada
    images.forEach(image => {
      const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image.src;
        img.addEventListener('load', () => {
          resolve(img);
        });
        img.addEventListener('error', () => {
          reject(new Error(`Não foi possível carregar a imagem ${image.src}`));
        });
      });
      promises.push(promise);
    });

    // espera todas as promessas serem resolvidas antes de permitir o usuário apertar o botão
    Promise.all(promises).then(() => {
      btn.removeAttribute('disabled');
    });

    // adiciona um evento de clique no botão
    btn.addEventListener('click', () => {
      imgs.forEach((img) => {
        const random = Math.floor(Math.random() * images.length);
        const url = images[random].src;
        const tempImg = new Image();
        tempImg.src = url;
        tempImg.addEventListener('load', () => {
          img.classList.add('fade-out');
          setTimeout(() => {
            img.src = url;
            img.classList.remove('fade-out');
          }, 700);
        });
      });
    });
  });
