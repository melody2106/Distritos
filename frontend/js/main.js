const API = '/api/distritos';
let paginaActual = 1;
const LIMIT = 8;
let busqueda = '';
let timeoutBusqueda;
let idSeleccionadoParaEliminar = null;

const tbody = document.getElementById('tbody');
const infoPagina = document.getElementById('infoPagina');
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
const buscador = document.getElementById('buscador');

const modalEditar = document.getElementById('modal');
const modalEliminar = document.getElementById('modal-eliminar');

const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const btnConfEliminar = document.getElementById('confirmar-eliminar');
const btnCancEliminar = document.getElementById('cancelar-eliminar');

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

function aplicarTema(tema) {
    if (tema === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
        if (themeText) themeText.textContent = 'Modo Claro';
    } else {
        document.body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
        if (themeText) themeText.textContent = 'Modo Oscuro';
    }
}

const temaGuardado = localStorage.getItem('theme') || 'light';
aplicarTema(temaGuardado);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const esOscuro = document.body.classList.toggle('dark-mode');
        const nuevoTema = esOscuro ? 'dark' : 'light';
        localStorage.setItem('theme', nuevoTema);
        aplicarTema(nuevoTema);
    });
}

async function cargarTabla() {
    try {
        const url = `${API}?page=${paginaActual}&limit=${LIMIT}&search=${encodeURIComponent(busqueda)}`;
        const res = await fetch(url);
        const json = await res.json();

        tbody.innerHTML = '';

        if (!json.data || json.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px; color: var(--text-muted);">No se encontraron distritos</td></tr>';
        } else {
            json.data.forEach(d => {
                const poblacionFormateada = Number(d.poblacion).toLocaleString('en-US');

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>#${d.id_dis}</strong></td>
                    <td>${d.nom_dis}</td>
                    <td><code>${d.cod_postal}</code></td>
                    <td>${d.supervisor || 'Sin asignar'}</td>
                    <td>${poblacionFormateada}</td> 
                    <td style="text-align: center;">
                        <button class="btn btn-edit" onclick="abrirEditar(${d.id_dis}, '${d.nom_dis}', '${d.cod_postal}', '${d.supervisor}', '${d.poblacion}')">
                            ✏️ Editar
                        </button>
                        <button class="btn btn-delete" onclick="prepararEliminar(${d.id_dis})">
                            🗑️ Borrar
                        </button>
                    </td>`;
                tbody.appendChild(tr);
            });
        }

        infoPagina.textContent = `Página ${json.currentPage} de ${json.totalPages}`;
        btnAnterior.disabled = paginaActual <= 1;
        btnSiguiente.disabled = paginaActual >= json.totalPages;

    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

btnAnterior.addEventListener('click', () => {
    if (paginaActual > 1) { 
        paginaActual--; 
        cargarTabla(); 
    }
});

btnSiguiente.addEventListener('click', () => {
    paginaActual++; 
    cargarTabla();
});

buscador.addEventListener('input', () => {
    clearTimeout(timeoutBusqueda);
    timeoutBusqueda = setTimeout(() => {
        busqueda = buscador.value.trim();
        paginaActual = 1;
        cargarTabla();
    }, 400);
});

window.abrirEditar = (id, nom, cod, supervisor, poblacion) => {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-nom').value = nom;
    document.getElementById('edit-cod').value = cod;
    document.getElementById('edit-supervisor').value = supervisor;
    document.getElementById('edit-poblacion').value = poblacion;
    modalEditar.classList.remove('oculto');
};

btnCancelar.addEventListener('click', () => {
    modalEditar.classList.add('oculto');
});

btnGuardar.addEventListener('click', async () => {
    const id = document.getElementById('edit-id').value;
    const nom = document.getElementById('edit-nom').value.trim();
    const cod = document.getElementById('edit-cod').value.trim();
    const supervisor = document.getElementById('edit-supervisor').value.trim();
    const poblacion = document.getElementById('edit-poblacion').value.trim();

    if (!nom || !cod || !supervisor || !poblacion) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nom_dis: nom, 
                cod_postal: cod, 
                supervisor: supervisor, 
                poblacion: parseInt(poblacion) 
            })
        });
        const json = await res.json();
        if (json.success) {
            modalEditar.classList.add('oculto');
            cargarTabla();
        } else {
            alert('Error: ' + json.message);
        }
    } catch (err) {
        alert('Error de conexión.');
    }
});

window.prepararEliminar = (id) => {
    idSeleccionadoParaEliminar = id;
    modalEliminar.classList.remove('oculto');
};

btnCancEliminar.addEventListener('click', () => {
    modalEliminar.classList.add('oculto');
    idSeleccionadoParaEliminar = null;
});

btnConfEliminar.addEventListener('click', async () => {
    if (!idSeleccionadoParaEliminar) return;

    try {
        const res = await fetch(`${API}/${idSeleccionadoParaEliminar}`, { method: 'DELETE' });
        const json = await res.json();

        if (json.success) {
            modalEliminar.classList.add('oculto');
            cargarTabla();
        } else {
            alert('Error: ' + json.message);
        }
    } catch (err) {
        alert('Error de conexión.');
    } finally {
        idSeleccionadoParaEliminar = null;
    }
});

document.addEventListener('DOMContentLoaded', cargarTabla);