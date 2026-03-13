function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    // Adiciona ou remove a classe 'active' que mostra o menu no CSS
    navLinks.classList.toggle('active');
}

// Opcional: Fecha o menu ao clicar em um link (melhora a experiência)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('nav-links').classList.remove('active');
    });
});
