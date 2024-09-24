document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.registration-form');
    const cerrarSesionBtn = document.getElementById('cerrarSesion');

    verificarEstadoSesion();

    if (formulario) {
        formulario.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            const formData = new FormData(formulario);
            const datos = new URLSearchParams(formData);

            try {
                const respuesta = await fetch('/api/IniciarSesion', {
                    method: 'POST',
                    body: datos,
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    localStorage.setItem('usuarioIniciado', 'true');
                    localStorage.setItem('IdUsuario', resultado.idUsuario);
                    localStorage.setItem('rangoUsuario', resultado.rango);
                    localStorage.setItem('nombre', resultado.nombre);
                    localStorage.setItem('apellidos', resultado.apellido);
                    localStorage.setItem('email', resultado.email);
                    localStorage.setItem('telefono', resultado.telefono);

                    console.log('Datos almacenados en localStorage:', {
                        usuarioIniciado: localStorage.getItem('usuarioIniciado'),
                        IdUsuario: localStorage.getItem('IdUsuario'),
                        rangoUsuario: localStorage.getItem('rangoUsuario'),
                        nombre: localStorage.getItem('nombre'),
                        apellidos: localStorage.getItem('apellidos'),
                        email: localStorage.getItem('email'),
                        telefono: localStorage.getItem('telefono')
                    });

                    actualizarMenus();

                    if (resultado.redirigir) {
                        setTimeout(() => {
                            window.location.href = resultado.redirigir;
                        }, 500);
                    }
                } else {
                    mostrarError(resultado.mensaje);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                mostrarError('Error en la solicitud');
            }
        });
    }

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {

            localStorage.removeItem('usuarioIniciado');
            localStorage.removeItem('IdUsuario');
            localStorage.removeItem('rangoUsuario');
            localStorage.removeItem('nombre');
            localStorage.removeItem('apellidos');
            localStorage.removeItem('email');
            localStorage.removeItem('telefono');

            actualizarMenus();

            window.location.href = '/incofer/InicioSesion.html';
        });
    }
});

function mostrarError(mensaje) {
    const overlay = document.getElementById('errorOverlay');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = mensaje;
    overlay.style.display = 'block';
}

function closeErrorOverlay() {
    const overlay = document.getElementById('errorOverlay');
    overlay.style.display = 'none';
}

function verificarEstadoSesion() {
    actualizarMenus();
}

function actualizarMenus() {
    const loginMenu = document.getElementById('loginMenu');
    const userMenu = document.getElementById('userMenu');
    const verComentariosBtn = document.querySelector('a[href="/incofer/vercomentarios.html"]');
    
    const usuarioIniciado = localStorage.getItem('usuarioIniciado');
    const rangoUsuario = localStorage.getItem('rangoUsuario');
    
    console.log("Estado del usuario:", usuarioIniciado);
    console.log("Rango del usuario:", rangoUsuario);

    if (usuarioIniciado === 'true') {
        loginMenu.style.display = 'none';
        userMenu.style.display = 'block';

        if (rangoUsuario === 'Administrador') {
            if (verComentariosBtn) {
                verComentariosBtn.style.display = 'block';
            }
        } else {
            if (verComentariosBtn) {
                verComentariosBtn.style.display = 'none';
            }
        }
    } else {
        loginMenu.style.display = 'block';
        userMenu.style.display = 'none';
    }
}
