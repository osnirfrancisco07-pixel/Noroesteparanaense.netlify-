let posts = JSON.parse(localStorage.getItem("posts")) || [];

let area = document.getElementById("posts");

posts.forEach(post => {

let div = document.createElement("div");
div.className = "post";

div.innerHTML = `
<h2>${post.titulo}</h2>
<p>${post.texto}</p>
<small>${post.categoria}</small>
`;

area.appendChild(div);

});