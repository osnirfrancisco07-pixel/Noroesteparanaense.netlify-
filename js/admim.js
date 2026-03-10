function publicar(){

let titulo = document.getElementById("titulo").value;
let texto = document.getElementById("texto").value;
let categoria = document.getElementById("categoria").value;

let posts = JSON.parse(localStorage.getItem("posts")) || [];

posts.unshift({
titulo:titulo,
texto:texto,
categoria:categoria
});
  
