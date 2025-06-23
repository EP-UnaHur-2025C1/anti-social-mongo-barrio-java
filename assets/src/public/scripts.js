document.getElementById("btnCrearPost").addEventListener("click", () => {
  const form = document.getElementById("formPostContainer");
  form.style.display = form.style.display === "none" ? "block" : "none";
});

document.getElementById("formPost").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  // Verifica que al menos el campo de texto tenga valor
  const postContent = form.querySelector('[name="postContent"]').value.trim();
  if (!postContent) {
    alert("Por favor, completa el contenido de la publicación.");
    return;
  }

  // Elimina cualquier input oculto o duplicado with name="tags" (por si quedó del select anterior)
  Array.from(form.querySelectorAll('input[name="tags"]')).forEach(el => el.remove());
  // Obtiene los tags seleccionados y los agrega al formData
  const checkedTags = Array.from(document.querySelectorAll('#tagsCheckboxes input[type="checkbox"]:checked')).map(cb => Number(cb.value));
  formData.append('tags', JSON.stringify(checkedTags));

  try {
    const res = await fetch("/posts/create", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById("outputPost").textContent = data.error || "Error al crear el post";
      throw new Error(data.error || 'Error al crear el post');
    }

    document.getElementById("outputPost").textContent = "Post creado correctamente ✅";
    form.reset();
    // Opcional: Oculta el formulario tras crear el post
    document.getElementById("formPostContainer").style.display = "none";
    // Actualiza la lista de publicaciones automáticamente
    document.getElementById("btnVerPosts").click();
  } catch (error) {
    document.getElementById("outputPost").textContent = error.message || "Error al crear el post";
    console.error("Error al crear el post", error);
  }
});

// document.getElementById("btnSeguirUsuario").addEventListener("click", async () => {
//   const res = await fetch("/user/follow", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       followerId: 1,
//       followedId: 2
//     })
//   });
//
//   const data = await res.json();
//   document.getElementById("output").textContent = JSON.stringify(data, null, 2);
// });

document.getElementById('btnCrearUsuario').addEventListener('click', () => {
  const form = document.getElementById('formUsuario');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
  // Elimina label y preview duplicados si existen
  const labels = form.querySelectorAll('#labelFotoUsuarioInput');
  labels.forEach((l, i) => { if (i > 0) l.remove(); });
  const previews = form.querySelectorAll('#previewFotoUsuario');
  previews.forEach((p, i) => { if (i > 0) p.remove(); });
  // Mostrar/crear previsualización de imagen si no existe
  let preview = document.getElementById('previewFotoUsuario');
  if (!preview) {
    preview = document.createElement('img');
    preview.id = 'previewFotoUsuario';
    preview.style.display = 'none';
    preview.style.maxWidth = '100px';
    preview.style.maxHeight = '100px';
    preview.style.marginTop = '8px';
    form.appendChild(preview);
  }
  // Mostrar texto aclaratorio si no existe
  let labelFoto = document.getElementById('labelFotoUsuarioInput');
  if (!labelFoto) {
    labelFoto = document.createElement('label');
    labelFoto.id = 'labelFotoUsuarioInput';
    labelFoto.htmlFor = 'fotoUsuarioInput';
    labelFoto.innerHTML = 'Imagen de perfil (opcional):';
    const input = document.getElementById('fotoUsuarioInput');
    input.parentNode.insertBefore(labelFoto, input);
  }
});

// Previsualización de imagen de perfil al seleccionar archivo
const fotoInput = document.getElementById('fotoUsuarioInput');
if (fotoInput) {
  fotoInput.addEventListener('change', function() {
    let preview = document.getElementById('previewFotoUsuario');
    if (!preview) {
      preview = document.createElement('img');
      preview.id = 'previewFotoUsuario';
      preview.style.display = 'none';
      preview.style.maxWidth = '100px';
      preview.style.maxHeight = '100px';
      preview.style.marginTop = '8px';
      this.parentNode.appendChild(preview);
    }
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(this.files[0]);
    } else {
      preview.src = '';
      preview.style.display = 'none';
    }
  });
}

document.getElementById('usuarioForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nickName = document.getElementById('nickName').value.trim();
  const email = document.getElementById('email').value.trim();
  const token = document.getElementById('account_device_token').value.trim();
  const fotoInput = document.getElementById('fotoUsuarioInput');

  if (!nickName || !email) {
    alert('Ambos campos son obligatorios.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor, ingresa un email válido.');
    return;
  }

  const formData = new FormData();
  formData.append('nickName', nickName);
  formData.append('email', email);
  formData.append('account_device_token', token);
  if (fotoInput && fotoInput.files && fotoInput.files[0]) {
    formData.append('foto', fotoInput.files[0]);
  }

  try {
    const res = await fetch('/user', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById('mensaje').innerText = 'Usuario creado correctamente ✅';
      usuarioForm.reset();
    } else {
      document.getElementById('mensaje').innerText = data.error || 'Error al crear usuario ❌';
    }

  } catch (err) {
    console.error(err);
    document.getElementById('mensaje').innerText = 'Error en la conexión con el servidor ❌';
  }
});

// Al cargar la página, obtener usuarios y poblar selects
window.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/user/all');
  const users = await res.json();
  // Para el formulario de post
  const postUserSelect = document.createElement('select');
  postUserSelect.id = 'userIdPostSelect';
  postUserSelect.name = 'userId';
  users.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.id;
    opt.textContent = u.nickName;
    postUserSelect.appendChild(opt);
  });
  const postForm = document.getElementById('formPost');
  const hiddenUserInput = document.getElementById('userIdPost');
  hiddenUserInput.parentNode.insertBefore(postUserSelect, hiddenUserInput);
  hiddenUserInput.remove();

  // Poblar checkboxes de tags
  const tagsRes = await fetch('/tags');
  const tags = await tagsRes.json();
  const tagsCheckboxes = document.getElementById('tagsCheckboxes');
  tagsCheckboxes.innerHTML = '';
  tags.forEach(tag => {
    const label = document.createElement('label');
    label.style.marginRight = '10px';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = tag.id;
    // NO poner name="tags" para evitar duplicados en FormData
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' #' + tag.name + ' '));
    tagsCheckboxes.appendChild(label);
  });

  // Permitir crear un nuevo tag desde el input
  const nuevoTagInput = document.getElementById('nuevoTagInput');
  if (nuevoTagInput) {
    nuevoTagInput.addEventListener('keydown', async function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const tagName = nuevoTagInput.value.trim();
        if (!tagName) return;
        // Crear tag en backend
        const res = await fetch('/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: tagName })
        });
        if (res.ok) {
          const tag = await res.json();
          // Agregar como checkbox
          const label = document.createElement('label');
          label.style.marginRight = '10px';
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = tag.id;
          // NO poner name="tags" aquí tampoco
          checkbox.checked = true;
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(' #' + tag.name + ' '));
          tagsCheckboxes.appendChild(label);
          nuevoTagInput.value = '';
        } else {
          alert('No se pudo crear el tag (puede que ya exista)');
        }
      }
    });
  }

  // Para los comentarios, guardar usuarios globalmente
  window._usuarios = users;

  // Poblar select de filtro de publicaciones
  const verPostsUsuarioSelect = document.getElementById('verPostsUsuarioSelect');
  if (verPostsUsuarioSelect) {
    verPostsUsuarioSelect.innerHTML = '<option value="">Todos</option>' + users.map(u => `<option value="${u.id}">${u.nickName}</option>`).join('');
  }

  // Poblar checkboxes de tags para filtrar publicaciones
  const tagsFiltroContainer = document.getElementById('tagsFiltroContainer');
  if (tagsFiltroContainer) {
    tagsFiltroContainer.innerHTML = '';
    tags.forEach(tag => {
      const label = document.createElement('label');
      label.style.marginRight = '10px';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = tag.id;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' #' + tag.name + ' '));
      tagsFiltroContainer.appendChild(label);
    });
    // Botón para filtrar
    let btnFiltrarTags = document.getElementById('btnFiltrarTags');
    if (!btnFiltrarTags) {
      btnFiltrarTags = document.createElement('button');
      btnFiltrarTags.id = 'btnFiltrarTags';
      btnFiltrarTags.textContent = 'Filtrar por tags';
      tagsFiltroContainer.appendChild(btnFiltrarTags);
    }
    btnFiltrarTags.onclick = async function() {
      const checked = Array.from(tagsFiltroContainer.querySelectorAll('input[type="checkbox"]:checked')).map(cb => Number(cb.value));
      if (checked.length === 0) {
        document.getElementById("btnVerPosts").click(); // Si no hay tags, mostrar todos
        return;
      }
      const res = await fetch(`/posts/by-tags?tags=${checked.join(',')}`);
      const data = await res.json();
      // Reutiliza el renderizado de publicaciones
      window.renderPosts(data);
    };
  }

  window._usuarioActual = users[0]; // Puedes cambiar esto por lógica de login real
  // Mostrar publicaciones automáticamente al cargar
  // const resPosts = await fetch('/post');
  // const posts = await resPosts.json();
  // window.renderPosts(posts);
});

// Toggle de publicaciones al hacer click en "Ver posts"
document.getElementById("btnVerPosts").addEventListener("click", async () => {
  const output = document.getElementById('output');
  if (output.style.display === 'none' || output.style.display === '') {
    // Mostrar publicaciones
    const userId = document.getElementById('verPostsUsuarioSelect').value;
    let res, data;
    if (userId) {
      res = await fetch(`/posts/user/${userId}`);
    } else {
      res = await fetch("/posts");
    }
    data = await res.json();
    window.renderPosts(data);
    output.style.display = 'block';
  } else {
    // Ocultar publicaciones
    output.style.display = 'none';
  }
});

// --- MODO OSCURO: aplicar antes de cualquier renderizado visual ---
(function() {
  // Aplica la clase dark-mode lo antes posible
  const dark = localStorage.getItem('modoOscuro') === '1';
  if (dark) document.body.classList.add('dark-mode');
  // Botón flotante
  window.addEventListener('DOMContentLoaded', () => {
    let btn = document.getElementById('toggleDarkMode');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'toggleDarkMode';
      btn.title = 'Modo oscuro/claro';
      btn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
      btn.style.position = 'fixed';
      btn.style.bottom = '20px';
      btn.style.right = '20px';
      btn.style.zIndex = '9999';
      btn.style.fontSize = '1.5em';
      btn.style.borderRadius = '50%';
      btn.style.border = 'none';
      btn.style.background = '#222';
      btn.style.color = '#fff';
      btn.style.width = '48px';
      btn.style.height = '48px';
      btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      btn.style.cursor = 'pointer';
      btn.onclick = function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        btn.innerHTML = isDark ? '☀️' : '🌙';
        localStorage.setItem('modoOscuro', isDark ? '1' : '0');
      };
      document.body.appendChild(btn);
    } else {
      btn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }
  });
})();

// Modifica renderPosts para aceptar un id de contenedor opcional
const originalRenderPosts = window.renderPosts;
window.renderPosts = function(data, containerId) {
  const container = containerId ? document.getElementById(containerId) : document.getElementById('output');
  if (!container) return;
  window._posts = data;
  fetch('/comment/all').then(r => r.json()).then(allComments => {
    const commentsByPost = {};
    allComments.forEach(c => {
      if (!commentsByPost[c.postId]) commentsByPost[c.postId] = [];
      commentsByPost[c.postId].push(c);
    });
    // Detectar si es feed de publicaciones comentadas (por nombre de contenedor)
    const isFeedComentados = containerId === 'feedComentados' || containerId === 'comentadasUsuario';
    const html = data.filter(post => post && post.id && post.text).map(post => {
      // --- MEJORA: Buscar usuario y su imagen de perfil ---
      let user = window._usuarios?.find(u => String(u.id) === String(post.userId));
      let userImg = user && user.profileImage ? user.profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(user ? user.nickName : post.userId)}&background=1976d2&color=fff&size=48`;
      // Botones solo si el usuario actual es el autor del post y NO es feedComentados
      var esAutorPost = window._usuarioActual && (String(window._usuarioActual.id) === String(post.userId));
      let deleteBtn = (!isFeedComentados && esAutorPost) ? `<button class='btnEliminarPost' data-postid='${post.id}' style='margin-left:10px;color:red;'>Eliminar</button>` : '';
      let editBtn = (!isFeedComentados && esAutorPost) ? `<button class='btnEditarPost' data-postid='${post.id}' style='margin-left:10px;color:blue;'>Editar</button>` : '';
      let comentarBtn = !isFeedComentados ? `<button class='btnComentar' data-postid='${post.id}'>Comentar</button>` : '';
      // Aviso visual si es feedComentados
      let avisoComentado = isFeedComentados ? `<div class='aviso-comentado' style='color:#1976d2;font-weight:bold;margin-bottom:5px;'>Publicación donde comentó este usuario</div>` : '';
      let imgHtml = post.imageUrl ? `<img src='${post.imageUrl}' alt='Imagen del post de ${user ? user.nickName : post.userId}' class='post-image'>` : "";
      let comentariosHtml;
      if (isFeedComentados && window._usuarioPerfilSeleccionado) {
        const userId = window._usuarioPerfilSeleccionado;
        comentariosHtml = (commentsByPost[post.id] || [])
          .filter(com => com.userId == userId)
          .map(com => {
            // Nunca mostrar botones en feedComentados
            return `<div class='comment'>
              <span class='comment-author'>${com.nickName || com.userId}:</span> 
              <span class='comment-text comentarioTexto' data-comentarioid='${com.id}'>${com.text}</span>
              <div class='editarComentarioContainer' id='editarComentarioContainer-${com.id}' style='display:none;'></div>
            </div>`;
          }).join("");
      } else {
        comentariosHtml = (commentsByPost[post.id] || []).map(com => {
          const esAutor = window._usuarioActual && (window._usuarioActual.id == com.userId);
          return `<div class='comment'>
            <span class='comment-author'>${com.nickName || com.userId}:</span> 
            <span class='comment-text comentarioTexto' data-comentarioid='${com.id}'>${com.text}</span> ${esAutor && !isFeedComentados ? `<div class='comment-actions'><button class='btnEditarComentario' data-comentarioid='${com.id}' data-postid='${post.id}'>Editar</button> <button class='btnEliminarComentario' data-comentarioid='${com.id}' data-postid='${post.id}'>Eliminar</button></div>` : ''}
            <div class='editarComentarioContainer' id='editarComentarioContainer-${com.id}' style='display:none;'></div>
          </div>`;
        }).join("");
      }
      let tagsHtml = post.tags && post.tags.length ? `<div class='post-tags'>${post.tags.map(t => `<span class='tag'>#${t.name.replace(/^#/, '')}</span>`).join(' ')}</div>` : '';
      return `<div class='card' style='margin-bottom:22px;'>
        ${avisoComentado}
        <div style='display:flex;align-items:center;margin-bottom:4px;'>
          <img src='${userImg}' class='avatar' alt='Avatar de ${user ? user.nickName : post.userId}' style='width:48px;height:48px;border-radius:50%;margin-right:8px;object-fit:cover;border:2px solid #1976d2;'>
          <span style='font-weight:bold;font-size:1.1em;'>${user ? user.nickName : post.userId}</span>
        </div>
        <div class='post-header'>
          <strong>Post #${post.id}</strong> <span class='post-author'>(por ${post.nickName || post.userId})</span>
          ${tagsHtml}
        </div>
        <div class='post-content'>
          <span>${post.text}</span>
          ${imgHtml}
        </div>
        <div class='post-actions'>
          ${deleteBtn}
          ${editBtn}
          ${comentarBtn}
        </div>
        ${!isFeedComentados ? `<div class='comentarioFormContainer' id='comentarioFormContainer-${post.id}' style='display:none;margin-top:5px;'>
          <form class='comentarioForm' data-postid='${post.id}'>
            <input type='text' name='comentario' placeholder='Escribe un comentario...' required style='width:70%'>
            <input type='hidden' name='postId' value='${post.id}'>
            <select name='userId' class='userIdSelect'></select>
            <button type='submit'>Enviar</button>
          </form>
          <div class='comentarioMsg' id='comentarioMsg-${post.id}'></div>
        </div>` : ''}
        <div class='comentariosList' id='comentariosList-${post.id}' style='margin-top:10px;'>${comentariosHtml}</div>
        <div class='editarPostContainer' id='editarPostContainer-${post.id}' style='display:none;margin-top:10px;'></div>
      </div>`;
    }).join("");
    container.innerHTML = html || "No hay publicaciones.";
    // Poblar selects de usuario en cada form de comentario
    if (!isFeedComentados) {
      container.querySelectorAll('.comentarioForm').forEach(form => {
        const select = form.querySelector('.userIdSelect');
        select.innerHTML = window._usuarios.map(u => `<option value='${u.id}'>${u.nickName}</option>`).join('');
      });
    }
    // Listeners solo si NO es feedComentados
    if (!isFeedComentados) {
      container.querySelectorAll('.comentarioForm').forEach(form => {
        form.addEventListener('submit', async function(e) {
          e.preventDefault();
          const text = this.querySelector('textarea, input[name="comentario"]').value;
          const postId = this.getAttribute('data-postid') || this.postId?.value || this.querySelector('[name="postId"]').value;
          const userId = this.getAttribute('data-userid') || this.userId?.value || this.querySelector('[name="userId"]').value;
          if (!text || !postId || !userId) return;
          try {
            const res = await fetch('/comment/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text, postId, userId })
            });
            const data = await res.json();
            const msgDiv = container.querySelector(`#comentarioMsg-${postId}`);
            if (res.ok) {
              msgDiv.textContent = 'Comentario enviado ✅';
              this.reset();
              document.getElementById('btnVerPosts').click();
            } else {
              msgDiv.textContent = data.error || 'Error al comentar';
            }
          } catch (err) {
            const msgDiv = container.querySelector(`#comentarioMsg-${postId}`);
            msgDiv.textContent = 'Error de conexión';
          }
        });
      });
      container.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('btnComentar')) {
          const postId = e.target.getAttribute('data-postid');
          container.querySelectorAll('.comentarioFormContainer').forEach(div => {
            div.style.display = 'none';
          });
          const formContainer = container.querySelector(`#comentarioFormContainer-${postId}`);
          if (formContainer) {
            formContainer.style.display = 'block';
          }
        }
      });
      container.querySelectorAll('.btnEliminarPost').forEach(btn => {
        btn.addEventListener('click', async function() {
          if (!confirm('¿Seguro que quieres eliminar este post?')) return;
          const postId = this.getAttribute('data-postid');
          const res = await fetch(`/posts/${postId}`, { method: 'DELETE' });
          if (res.ok) {
            document.getElementById('btnVerPosts').click();
          } else {
            alert('Error al eliminar el post');
          }
        });
      });
      container.querySelectorAll('.btnEditarPost').forEach(btn => {
        btn.addEventListener('click', function() {
          const postId = this.getAttribute('data-postid');
          mostrarFormularioEdicion(postId);
        });
      });
      container.querySelectorAll('.btnEliminarComentario').forEach(btn => {
        btn.addEventListener('click', async function() {
          if (!confirm('¿Seguro que quieres eliminar este comentario?')) return;
          const comentarioId = this.getAttribute('data-comentarioid');
          const res = await fetch(`/comment/${comentarioId}`, { method: 'DELETE' });
          if (res.ok) {
            document.getElementById('btnVerPosts').click();
          } else {
            alert('Error al eliminar el comentario');
          }
        });
      });
      container.querySelectorAll('.btnEditarComentario').forEach(btn => {
        btn.addEventListener('click', function() {
          const comentarioId = this.getAttribute('data-comentarioid');
          const postId = this.getAttribute('data-postid');
          mostrarFormularioEdicionComentario(comentarioId, postId);
        });
      });
    }
  });
};

// Formulario de edición de post
function mostrarFormularioEdicion(postId) {
  // Buscar el card por clase, no por estilo inline
  const editarContainer = document.getElementById(`editarPostContainer-${postId}`);
  // Obtener datos actuales del post
  const post = window._posts?.find(p => p.id == postId);
  if (!post) return;
  // Renderizar formulario
  editarContainer.innerHTML = `
    <form class='formEditarPost' data-postid='${postId}' enctype='multipart/form-data'>
      <textarea name='text' style='width:90%;height:60px;'>${post.text || ''}</textarea><br>
      <label>Imagen actual:</label><br>
      ${post.imageUrl ? `<img src='${post.imageUrl}' style='max-width:120px;'><br><button type='button' class='btnQuitarImagen' data-postid='${postId}'>Quitar imagen</button><br>` : '<span>No hay imagen</span><br>'}
      <input type='file' name='image' accept='image/*'><br>
      <label>Tags:</label><br>
      <div class='editarTagsCheckboxes'></div>
      <button type='submit'>Guardar cambios</button>
      <button type='button' class='btnCancelarEdicion' data-postid='${postId}'>Cancelar</button>
    </form>
    <div class='editarMsg' id='editarMsg-${postId}'></div>
  `;
  editarContainer.style.display = 'block';
  // Poblar tags
  fetch('/tags').then(r => r.json()).then(tags => {
    const tagsDiv = editarContainer.querySelector('.editarTagsCheckboxes');
    tagsDiv.innerHTML = tags.map(tag => `<label style='margin-right:10px;'><input type='checkbox' value='${tag.id}' ${post.tags.some(t => t.id === tag.id) ? 'checked' : ''}> #${tag.name}</label>`).join('');
  });
  // Listener para quitar imagen
  editarContainer.querySelector('.btnQuitarImagen')?.addEventListener('click', function() {
    editarContainer.querySelector('img')?.remove();
    this.remove();
    editarContainer.querySelector('input[name="image"]').value = '';
    editarContainer.setAttribute('data-remove-image', 'true');
  });
  // Listener cancelar
  editarContainer.querySelector('.btnCancelarEdicion').addEventListener('click', function() {
    editarContainer.style.display = 'none';
  });
  // Listener submit edición
  editarContainer.querySelector('.formEditarPost').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    // Tags seleccionados
    const checkedTags = Array.from(editarContainer.querySelectorAll('.editarTagsCheckboxes input[type="checkbox"]:checked')).map(cb => Number(cb.value));
    formData.append('tags', JSON.stringify(checkedTags));
    // Quitar imagen
    if (editarContainer.getAttribute('data-remove-image') === 'true') {
      formData.append('removeImage', 'true');
    }
    try {
      const res = await fetch(`/posts/${postId}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        document.getElementById('editarMsg-' + postId).textContent = 'Post actualizado ✅';
        editarContainer.style.display = 'none';
        document.getElementById('btnVerPosts').click();
      } else {
        document.getElementById('editarMsg-' + postId).textContent = data.error || 'Error al actualizar';
      }
    } catch (err) {
      document.getElementById('editarMsg-' + postId).textContent = 'Error de conexión';
    }
  });
}

// Listener para editar comentario
setTimeout(() => {
  document.querySelectorAll('.btnEditarComentario').forEach(btn => {
    btn.addEventListener('click', function() {
      const comentarioId = this.getAttribute('data-comentarioid');
      const postId = this.getAttribute('data-postid');
      mostrarFormularioEdicionComentario(comentarioId, postId);
    });
  });
}, 200);

function mostrarFormularioEdicionComentario(comentarioId, postId) {
  const comentarioSpan = document.querySelector(`.comentarioTexto[data-comentarioid='${comentarioId}']`);
  const editarContainer = document.getElementById(`editarComentarioContainer-${comentarioId}`);
  editarContainer.innerHTML = `
    <form class='formEditarComentario' data-comentarioid='${comentarioId}' data-postid='${postId}'>
      <input type='text' name='text' value='${comentarioSpan.textContent}' style='width:70%'>
      <button type='submit'>Guardar</button>
      <button type='button' class='btnCancelarEdicionComentario'>Cancelar</button>
    </form>
    <div class='editarComentarioMsg'></div>
  `;
  editarContainer.style.display = 'block';
  editarContainer.querySelector('.btnCancelarEdicionComentario').onclick = function() {
    editarContainer.style.display = 'none';
  };
  editarContainer.querySelector('.formEditarComentario').onsubmit = async function(e) {
    e.preventDefault();
    const text = this.text.value.trim();
    const msgDiv = editarContainer.querySelector('.editarComentarioMsg');
    if (!text) {
      msgDiv.textContent = 'El comentario no puede estar vacío';
      return;
    }
    try {
      const res = await fetch(`/posts/${comentarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (res.ok) {
        comentarioSpan.textContent = text;
        editarContainer.style.display = 'none';
      } else {
        msgDiv.textContent = data.error || 'Error al actualizar';
      }
    } catch (err) {
      msgDiv.textContent = 'Error de conexión';
    }
  };
}

// Nueva función para renderizar la lista de usuarios
async function renderListaUsuarios() {
  const usuariosListDiv = document.getElementById('usuariosList');
  usuariosListDiv.textContent = 'Cargando...';
  // Elimina estilos inline para fondo, borde y color (se manejarán solo por CSS)
  usuariosListDiv.removeAttribute('style');
  try {
    const res = await fetch('/user/all');
    const users = await res.json();
    if (Array.isArray(users) && users.length > 0) {
      usuariosListDiv.innerHTML = '<div style="color:green;font-weight:bold;">Usuarios cargados correctamente:</div><ul id="usuariosUl" style="list-style:none;padding:0;">' + users.map(u => `<li class="usuarioItem" data-userid="${u.id}" style="cursor:pointer;display:flex;align-items:center;padding:7px 0;border-bottom:1px solid #e0e0e0;transition:background 0.2s;" onmouseover="this.style.background='#f0f8ff'" onmouseout="this.style.background=''">
  <img src="${u.profileImage ? u.profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nickName)}&background=1976d2&color=fff&size=48`}" class="avatar" style="width:48px;height:48px;border-radius:50%;margin-right:10px;object-fit:cover;">
  <strong>${u.nickName}</strong> <span style="color:#888;font-size:0.95em;margin-left:7px;">(ID: ${u.id})</span>
</li>`).join('') + '</ul>';
      // Listener para cada usuario
      usuariosListDiv.querySelectorAll('.usuarioItem').forEach(item => {
        item.onclick = async function() {
          const userId = this.getAttribute('data-userid');
          window._usuarioPerfilSeleccionado = Number(userId); // <-- para renderPosts
          // Render perfil de usuario con publicaciones propias y comentadas
          usuariosListDiv.innerHTML = `
            <div style='font-weight:bold;font-size:1.2em;margin-bottom:10px;'>Perfil de usuario</div>
            <div style='display:flex;align-items:center;margin-bottom:10px;'>
              <img src='${users.find(u=>u.id==userId)?.profileImage ? users.find(u=>u.id==userId).profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(users.find(u=>u.id==userId)?.nickName || userId)}&background=1976d2&color=fff&size=48`}' style='width:48px;height:48px;border-radius:50%;margin-right:12px;'>
              <div>
                <div><strong>ID:</strong> ${userId}</div>
                <div><strong>Nick:</strong> ${users.find(u=>u.id==userId)?.nickName || userId}</div>
              </div>
            </div>
            <div id='seguirUsuarioContainer' style='margin:15px 0;'></div>
            <div id='reviewUsuario' style='margin-top:20px;'></div>
            <div id='comentadasUsuario' style='margin-top:30px;'></div>
            <button id='volverUsuarios' style='margin-top:20px;background:#1976d2;color:white;border:none;padding:7px 18px;border-radius:6px;cursor:pointer;'>Volver a la lista de usuarios</button>
            <button id='eliminarUsuario' style='margin-top:20px;margin-left:10px;background:#e53935;color:white;border:none;padding:7px 18px;border-radius:6px;cursor:pointer;'>Eliminar usuario</button>`;
          // --- SEGUIR/DEJAR DE SEGUIR USUARIO ---
          const seguirContainer = document.getElementById('seguirUsuarioContainer');
          seguirContainer.innerHTML = `
            <div style='margin-bottom:8px;'>
              <label for='selectSeguidor'>Seguir como: </label>
              <select id='selectSeguidor' style='padding:3px 7px;border-radius:5px;border:1px solid #bbb;'></select>
              <button id='btnSeguirUsuario' style='background:#43a047;color:white;border:none;padding:5px 12px;border-radius:5px;cursor:pointer;transition:background 0.2s;'>Seguir</button>
              <button id='btnUnfollowUsuario' style='margin-left:5px;background:#e53935;color:white;border:none;padding:5px 12px;border-radius:5px;cursor:pointer;transition:background 0.2s;'>Dejar de seguir</button>
              <span id='msgSeguirUsuario' style='margin-left:10px;'></span>
            </div>
            <div id='seguidoresSeguidos' style='margin-top:10px;'></div>`;
          const selectSeguidor = document.getElementById('selectSeguidor');
          selectSeguidor.innerHTML = window._usuarios.filter(u => u.id != userId).map(u => `<option value='${u.id}'>${u.nickName}</option>`).join('');
          const btnSeguirUsuario = document.getElementById('btnSeguirUsuario');
          const btnUnfollowUsuario = document.getElementById('btnUnfollowUsuario');
          const msgSeguirUsuario = document.getElementById('msgSeguirUsuario');
          const seguidoresSeguidosDiv = document.getElementById('seguidoresSeguidos');

          // Mostrar lista de seguidores y seguidos
          async function renderSeguidoresSeguidos() {
            seguidoresSeguidosDiv.innerHTML = '<span style="color:#888">Cargando seguidores/seguidos...</span>';
            try {
              const [resSeg, resSig] = await Promise.all([
                fetch(`/user/${userId}/followers`),
                fetch(`/user/${userId}/following`)
              ]);
              const seguidores = await resSeg.json();
              const seguidos = await resSig.json();
              seguidoresSeguidosDiv.innerHTML =
                `<div style='margin-bottom:3px;'><b>Seguidores</b> <span style='background:#1976d2;color:white;border-radius:10px;padding:2px 8px;font-size:0.9em;margin-left:3px;'>${Array.isArray(seguidores) ? seguidores.length : 0}</span>:` +
                `${Array.isArray(seguidores) && seguidores.length ? seguidores.map(u => `<span class='seguidorItem' data-userid='${u.id}' style='cursor:pointer;color:#1976d2;text-decoration:underline;margin-right:7px;'>${u.nickName || u.id}</span>`).join('') : ' <span style="color:#aaa">Ninguno</span>'}</div>` +
                `<div><b>Seguidos</b> <span style='background:#1976d2;color:white;border-radius:10px;padding:2px 8px;font-size:0.9em;margin-left:3px;'>${Array.isArray(seguidos) ? seguidos.length : 0}</span>:` +
                `${Array.isArray(seguidos) && seguidos.length ? seguidos.map(u => `<span class='seguidoItem' data-userid='${u.id}' style='cursor:pointer;color:#1976d2;text-decoration:underline;margin-right:7px;'>${u.nickName || u.id}</span>`).join('') : ' <span style="color:#aaa">Ninguno</span>'}</div>`;
            } catch {
              seguidoresSeguidosDiv.innerHTML = '<span style="color:red">Error al cargar seguidores/seguidos</span>';
            }
          }

          // Comprobar si el usuario ya sigue al perfil
          async function actualizarEstadoFollow() {
            const followerId = selectSeguidor.value;
            if (!followerId) {
              btnSeguirUsuario.disabled = true;
              btnUnfollowUsuario.disabled = true;
              btnUnfollowUsuario.style.display = 'none';
              btnSeguirUsuario.style.display = 'inline-block';
              return;
            }
            try {
              const res = await fetch(`/user/${followerId}/following`);
              const data = await res.json();
              const yaSigue = Array.isArray(data) && data.some(u => u.id == userId);
              btnSeguirUsuario.disabled = yaSigue;
              btnSeguirUsuario.style.display = yaSigue ? 'none' : 'inline-block';
              btnUnfollowUsuario.disabled = !yaSigue;
              btnUnfollowUsuario.style.display = yaSigue ? 'inline-block' : 'none';
            } catch {
              btnSeguirUsuario.disabled = false;
              btnUnfollowUsuario.disabled = false;
              btnUnfollowUsuario.style.display = 'none';
              btnSeguirUsuario.style.display = 'inline-block';
            }
          }
          selectSeguidor.onchange = () => { actualizarEstadoFollow(); renderSeguidoresSeguidos(); };
          actualizarEstadoFollow();
          renderSeguidoresSeguidos();

          btnSeguirUsuario.onclick = async function() {
            const followerId = selectSeguidor.value;
            const followedId = userId;
            if (!followerId || !followedId) {
              msgSeguirUsuario.textContent = 'Selecciona un usuario válido.';
              msgSeguirUsuario.style.color = 'red';
              return;
            }
            if (followerId == followedId) {
              msgSeguirUsuario.textContent = 'No puedes seguirte a ti mismo.';
              msgSeguirUsuario.style.color = 'red';
              return;
            }
            // Comprobar si ya sigue antes de hacer la petición
            const resCheck = await fetch(`/user/${followerId}/following`);
            const dataCheck = await resCheck.json();
            const yaSigue = Array.isArray(dataCheck) && dataCheck.some(u => u.id == userId);
            if (yaSigue) {
              msgSeguirUsuario.textContent = 'Ya sigues a este usuario.';
              msgSeguirUsuario.style.color = 'red';
              actualizarEstadoFollow();
              return;
            }
            btnSeguirUsuario.disabled = true;
            msgSeguirUsuario.textContent = 'Procesando...';
            msgSeguirUsuario.style.color = '#888';
            try {
              const res = await fetch(`/user/${followedId}/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ followerId })
              });
              const data = await res.json();
              if (res.ok) {
                msgSeguirUsuario.textContent = '¡Ahora sigues a este usuario!';
                msgSeguirUsuario.style.color = 'green';
              } else {
                msgSeguirUsuario.textContent = data.error || 'Error al seguir usuario';
                msgSeguirUsuario.style.color = 'red';
              }
            } catch (err) {
              msgSeguirUsuario.textContent = 'Error de conexión';
              msgSeguirUsuario.style.color = 'red';
            }
            actualizarEstadoFollow();
          };

          btnUnfollowUsuario.onclick = async function() {
            const followerId = selectSeguidor.value;
            const followedId = userId;
            if (!followerId || !followedId) {
              msgSeguirUsuario.textContent = 'Selecciona un usuario válido.';
              msgSeguirUsuario.style.color = 'red';
              return;
            }
            if (followerId == followedId) {
              msgSeguirUsuario.textContent = 'No puedes dejar de seguirte a ti mismo.';
              msgSeguirUsuario.style.color = 'red';
              return;
            }
            btnUnfollowUsuario.disabled = true;
            msgSeguirUsuario.textContent = 'Procesando...';
            msgSeguirUsuario.style.color = '#888';
            try {
              const res = await fetch(`/user/${followedId}/unfollow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ followerId })
              });
              const data = await res.json();
              if (res.ok) {
                msgSeguirUsuario.textContent = 'Has dejado de seguir a este usuario.';
                msgSeguirUsuario.style.color = 'orange';
              } else {
                msgSeguirUsuario.textContent = data.error || 'Error al dejar de seguir';
                msgSeguirUsuario.style.color = 'red';
              }
            } catch (err) {
              msgSeguirUsuario.textContent = 'Error de conexión';
              msgSeguirUsuario.style.color = 'red';
            }
            actualizarEstadoFollow();
          };
          // --- Publicaciones propias ---
          const reviewDiv = document.getElementById('reviewUsuario');
          reviewDiv.innerHTML = '<b>Publicaciones del usuario:</b> <span style="color:#888">(tipo feed)</span><br>';
          const resPosts = await fetch(`/posts/user/${userId}`);
          const posts = await resPosts.json();
          if (Array.isArray(posts) && posts.length > 0) {
            const tempDiv = document.createElement('div');
            tempDiv.id = 'feedUsuario';
            reviewDiv.appendChild(tempDiv);
            window.renderPosts(posts, 'feedUsuario');
          } else {
            reviewDiv.innerHTML += '<div style="color:#888">No tiene publicaciones propias.</div>';
          }
          // --- Publicaciones donde comentó ---
          const comentadasDiv = document.getElementById('comentadasUsuario');
          comentadasDiv.innerHTML = '<b>Publicaciones donde comentó:</b><br>Cargando...';
          const resComent = await fetch(`/comment/user/${userId}`);
          const comentariosUsuario = await resComent.json();
          let postIdsComentados = [...new Set(comentariosUsuario.map(c => c.postId))];
          let postsComentados = [];
          if (postIdsComentados.length > 0) {
            // Intentar obtener todos los posts de una vez (si existe el endpoint)
            let resPostsComentados, postsArray;
            try {
              resPostsComentados = await fetch(`/posts/by-ids?ids=${postIdsComentados.join(',')}`);
              if (resPostsComentados.ok) {
                postsArray = await resPostsComentados.json();
                if (!Array.isArray(postsArray)) throw new Error('No array');
                postsComentados = postsArray;
              } else {
                throw new Error('404');
              }
            } catch {
              // Fallback: fetch uno a uno
              postsComentados = await Promise.all(postIdsComentados.map(async pid => {
                const res = await fetch(`/post/${pid}`);
                if (!res.ok) return null;
                const post = await res.json();
                if (!post.nickName) {
                  const user = window._usuarios.find(u => u.id == post.userId);
                  post.nickName = user ? user.nickName : post.userId;
                }
                if (!post.tags) post.tags = [];
                return post;
              }));
              postsComentados = postsComentados.filter(Boolean);
            }
          }
          if (postsComentados.length > 0) {
            comentadasDiv.innerHTML = '';
            window.renderPosts(postsComentados, 'comentadasUsuario');
          } else {
            comentadasDiv.innerHTML = '<div style="color:#888">No hay publicaciones comentadas.</div>';
          }
          // Botón volver: vuelve a mostrar la lista de usuarios
          document.getElementById('volverUsuarios').onclick = renderListaUsuarios;

          // --- Listener para eliminar usuario ---
          document.getElementById('eliminarUsuario').onclick = async function() {
            const usuarioActual = window._usuarioActual;
            if (!usuarioActual || String(usuarioActual.id) !== String(userId)) {
              alert('Solo puedes eliminar tu propio usuario.');
              return;
            }
            if (!confirm('¿Seguro que quieres eliminar tu usuario? Esta acción no se puede deshacer.')) return;
            this.disabled = true;
            this.textContent = 'Eliminando...';
            try {
              const res = await fetch(`/user/${userId}`, { method: 'DELETE' });
              if (res.ok) {
                // Eliminar usuario del array global
                window._usuarios = window._usuarios.filter(u => String(u.id) !== String(userId));
                // Si el usuario actual era el eliminado, cambiar a otro usuario (si hay)
                if (window._usuarios.length > 0) {
                  window._usuarioActual = window._usuarios[0];
                } else {
                  window._usuarioActual = null;
                }
                // Actualizar selector de usuario actual
                const select = document.getElementById('selectUsuarioActual');
                if (select) {
                  select.innerHTML = window._usuarios.map(u => `<option value='${u.id}'>${u.nickName}</option>`).join('');
                  if (window._usuarioActual) select.value = window._usuarioActual.id;
                }
                // Volver a la lista de usuarios
                renderListaUsuarios();
                // Feedback visual
                setTimeout(() => {
                  const usuariosListDiv = document.getElementById('usuariosList');
                  if (usuariosListDiv) {
                    usuariosListDiv.insertAdjacentHTML('afterbegin', '<div style="color:green;font-weight:bold;">Usuario eliminado correctamente ✅</div>');
                  }
                }, 200);
              } else {
                this.disabled = false;
                this.textContent = 'Eliminar usuario';
                alert('Error al eliminar el usuario.');
              }
            } catch (err) {
              this.disabled = false;
              this.textContent = 'Eliminar usuario';
              alert('Error de conexión al eliminar usuario.');
            }
          };
        };
      });
    } else {
      usuariosListDiv.innerHTML = '<div style="color:red;font-weight:bold;">No se encontraron usuarios.</div>';
    }
  } catch (err) {
    usuariosListDiv.innerHTML = '<div style="color:red;font-weight:bold;">Error al cargar usuarios.</div>';
    console.error(err);
  }
}

// --- Botón y div para ver usuarios ---
let btn = document.getElementById('btnVerUsuarios');
if (!btn) {
  btn = document.createElement('button');
  btn.id = 'btnVerUsuarios';
  btn.textContent = 'Ver usuarios';
  btn.style.marginRight = '10px';
  // Insertar después del botón de crear usuario si existe
  const refBtn = document.getElementById('btnCrearUsuario');
  if (refBtn && refBtn.parentNode) {
    refBtn.parentNode.insertBefore(btn, refBtn.nextSibling);
  } else {
    document.body.insertBefore(btn, document.body.firstChild);
  }
}
if (!document.getElementById('usuariosList')) {
  const div = document.createElement('div');
  div.id = 'usuariosList';
  div.style.marginTop = '10px';
  document.body.appendChild(div);
}
// Listener para mostrar la lista de usuarios
btn.onclick = renderListaUsuarios;

// --- Selector de usuario actual para pruebas (solo frontend) ---
(function() {
  window.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('selectorUsuarioActual')) {
      const div = document.createElement('div');
      div.id = 'selectorUsuarioActual';
      div.style.position = 'fixed';
      div.style.bottom = '20px';
      div.style.left = '20px';
      div.style.top = '';
      div.style.zIndex = '9999';
      div.style.background = '#fff';
      div.style.padding = '7px 14px';
      div.style.borderRadius = '8px';
      div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
      div.style.fontSize = '1em';
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.innerHTML = `<span style='margin-right:7px;'>Usuario actual:</span><select id='selectUsuarioActual'></select>`;
      document.body.appendChild(div);
      // --- MODO OSCURO para el selector de usuario actual ---
      const style = document.createElement('style');
      style.innerHTML = `
        #selectorUsuarioActual { transition: background 0.2s, color 0.2s; }
        body.dark-mode #selectorUsuarioActual {
          background: #23272f !important;
          color: #fff !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        body.dark-mode #selectorUsuarioActual select {
          background: #23272f !important;
          color: #fff !important;
          border: 1px solid #444 !important;
        }
        body.dark-mode #selectorUsuarioActual span {
          color: #fff !important;
        }
      `;
      document.head.appendChild(style);
      // Poblar select
      const select = div.querySelector('#selectUsuarioActual');
      function poblarUsuarios() {
        if (!window._usuarios) return setTimeout(poblarUsuarios, 200);
        select.innerHTML = window._usuarios.map(u => `<option value='${u.id}'>${u.nickName}</option>`).join('');
        // Seleccionar el actual
        if (window._usuarioActual) select.value = window._usuarioActual.id;
      }
      poblarUsuarios();
      select.onchange = function() {
        const nuevo = window._usuarios.find(u => String(u.id) === String(this.value));
        if (nuevo) {
          window._usuarioActual = nuevo;
          document.getElementById('btnVerPosts').click();
        }
      };
    }
  });
})();




