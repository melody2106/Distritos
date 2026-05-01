const API = '/api/distritos';

document.getElementById('btnRegistrar').addEventListener('click', async () => {
  const nom_dis = document.getElementById('nom_dis').value.trim();
  const cod_postal = document.getElementById('cod_postal').value.trim();
  const supervisor = document.getElementById('supervisor').value.trim();
  const poblacion = document.getElementById('poblacion').value.trim();
  const mensaje = document.getElementById('mensaje');

  if (!nom_dis || !cod_postal || !supervisor || !poblacion) {
    mensaje.innerHTML = '<p class="error">Completa todos los campos.</p>';
    return;
  }

  const res  = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom_dis, cod_postal, supervisor, poblacion })
  });
  const json = await res.json();

  if (json.success) {
    mensaje.innerHTML = '<p class="exito">✅ Registrado correctamente. Redirigiendo...</p>';
    setTimeout(() => { window.location.href = '/index.html'; }, 1200);
  } else {
    mensaje.innerHTML = `<p class="error">Error: ${json.message}</p>`;
  }
});