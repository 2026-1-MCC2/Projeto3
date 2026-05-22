fetch('http://localhost:3000/anuncios')
  .then(res => res.json())
  .then(data => {
    const lista = document.getElementById('lista');

    data.forEach(produto => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
       <img src="${produto.imagem || 'images/notebook.jpg'}" />

        <div class="card-content">
          <h2>${produto.nome}</h2>
          <p><strong>Marca:</strong> ${produto.marca}</p>

          <p class="preco">R$ ${produto.moq || 0}</p>

          <a href="#" class="btn">Comprar</a>
        </div>
      `;

      lista.appendChild(card);
    });
  })
  .catch(err => console.log(err));