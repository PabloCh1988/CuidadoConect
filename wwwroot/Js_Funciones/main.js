function cargarVista(view) {
    fetch(`../views/${view}.html`)
        .then(res => res.text())
        .then(html => {
            const app = document.getElementById('app');
            app.innerHTML = html;
            if (view === 'personas') {
                ObtenerPersonas();
                ObtenerEmpleados();
            }
            // } else if (view === 'ticket') {
            //     ObtenerTickets();
            // } else if (view === 'cliente') {
            //     ObtenerClientes();
            // } else if (view === 'puestolaboral') {
            //     ObtenerPuestos();
            // } else if (view === 'desarrollador') {
            //     ObtenerDesarrolladores();
            // }

            // Ejecutar scripts de la vista si los hay
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const scripts = tempDiv.querySelectorAll('script');

            scripts.forEach(script => {
                const nuevoScript = document.createElement('script');
                if (script.src) {
                    nuevoScript.src = script.src;
                } else {
                    nuevoScript.textContent = script.textContent;
                }
                document.body.appendChild(nuevoScript);
            });
        });
}

function cargarVistaPorHash() {
    let vista = window.location.hash.replace('#', '') || 'home';
    cargarVista(vista);
}

function navigateTo(vista) {
    window.location.hash = vista;
}

// function actualizarLinkActivo() {
//     const vistaActual = window.location.hash.replace('#', '') || 'home';

//     const todosItemsNav = document.querySelectorAll('.nav-item');
//     todosItemsNav.forEach(item => item.classList.remove('active'));

//     const todosLinks = document.querySelectorAll('a[href^="#"]');
//     todosLinks.forEach(link => {
//         const href = link.getAttribute('href').replace('#', '');
//         if (href === vistaActual) {
//             link.classList.add('active');
//         } else {
//             link.classList.remove('active');
//         }
//     });
// }
// Escuchar cambios en la URL con hash
window.addEventListener('hashchange', cargarVistaPorHash);

// window.addEventListener('load', actualizarLinkActivo);

// Cargar vista inicial
window.addEventListener('DOMContentLoaded', () => {
    // actualizarLinkActivo();
    cargarVistaPorHash();
    // verificarUsuario();
});