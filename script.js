// Busca os posts salvos no navegador ou inicia um array vazio
let posts = JSON.parse(localStorage.getItem("posts")) || [];

let area = document.getElementById("posts");

// Mapeia e exibe cada post no container HTML
posts.forEach(post => {
    let div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
        <h2>${post.titulo}</h2>
        <p>${post.texto}</p>
        <small>Categoria: <strong>${post.categoria}</strong></small>
    `;

    area.appendChild(div);
});
