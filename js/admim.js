const DRAFT_KEY = 'postDraft';
const POSTS_KEY = 'posts';

function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback;
  } catch (error) {
    console.error('Erro ao interpretar dados salvos:', error);
    return fallback;
  }
}

function getAdminFields() {
  return {
    tituloEl: document.getElementById('titulo'),
    textoEl: document.getElementById('texto'),
    categoriaEl: document.getElementById('categoria')
  };
}

function salvarRascunhoAutomatico() {
  const { tituloEl, textoEl, categoriaEl } = getAdminFields();
  if (!tituloEl || !textoEl || !categoriaEl) return;

  const draft = {
    titulo: tituloEl.value,
    texto: textoEl.value,
    categoria: categoriaEl.value,
    atualizadoEm: new Date().toISOString()
  };

  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function restaurarRascunho() {
  const { tituloEl, textoEl, categoriaEl } = getAdminFields();
  if (!tituloEl || !textoEl || !categoriaEl) return;

  const draft = safeParse(localStorage.getItem(DRAFT_KEY), null);
  if (!draft) return;

  tituloEl.value = draft.titulo || '';
  textoEl.value = draft.texto || '';

  if (draft.categoria) {
    const existeCategoria = Array.from(categoriaEl.options).some(option => option.value === draft.categoria);
    if (existeCategoria) {
      categoriaEl.value = draft.categoria;
    }
  }
}

function inicializarAutoSave() {
  const { tituloEl, textoEl, categoriaEl } = getAdminFields();

  if (!tituloEl || !textoEl || !categoriaEl) {
    return;
  }

  restaurarRascunho();

  [tituloEl, textoEl, categoriaEl].forEach(field => {
    field.addEventListener('input', salvarRascunhoAutomatico);
    field.addEventListener('change', salvarRascunhoAutomatico);
  });
}

function publicar() {
  const { tituloEl, textoEl, categoriaEl } = getAdminFields();

  if (!tituloEl || !textoEl || !categoriaEl) {
    console.error('Campos de publicação não encontrados na página.');
    return;
  }

  const titulo = tituloEl.value.trim();
  const texto = textoEl.value.trim();
  const categoria = categoriaEl.value;

  if (!titulo || !texto) {
    alert('Preencha título e texto antes de publicar.');
    return;
  }

  const posts = safeParse(localStorage.getItem(POSTS_KEY), []);

  posts.unshift({
    titulo,
    texto,
    categoria,
    data: new Date().toISOString()
  });

  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  localStorage.removeItem(DRAFT_KEY);

  tituloEl.value = '';
  textoEl.value = '';
  categoriaEl.selectedIndex = 0;

  alert('Publicação salva com sucesso.');
}

document.addEventListener('DOMContentLoaded', inicializarAutoSave);
