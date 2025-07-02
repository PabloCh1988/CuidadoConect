function mostrarRegistro() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}

function mostrarLogin() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
}

const API_Base = "https://localhost:7233/api/auth";

const registerForm = document.getElementById("registerForm"); //
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => { // Agregar el evento de envío al formulario de registro
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario, es decir, que se recargue la pagina
        // Obtener los valores de los campos del formulario
        const data = {
            nombreCompleto: document.getElementById("regNombre").value, // Obtener el nombre completo
            email: document.getElementById("regEmail").value, // Obtener el email
            password: document.getElementById("regPassword").value // Obtener la contraseña
        };

        const response = await fetch(`${API_Base}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }); // Enviar la solicitud POST a la API

        const result = await response.text(); // Obtener la respuesta de la API
        // Mostrar mensaje de éxito o error
        Swal.fire({
            title: 'Respuesta del servidor',
            text: result,
            icon: 'info',
            background: '#f1f1f1',
            color: '#000000',
            confirmButtonText: 'Aceptar'
        });
    });

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => { // Agregar el evento de envío al formulario de inicio de sesión
            e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
            // Obtener los valores de los campos del formulario
            const data = {
                email: document.getElementById("loginEmail").value,
                password: document.getElementById("loginPassword").value
            };

            const response = await fetch(`${API_Base}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }); // Enviar la solicitud POST a la API

            if (response.ok) {
                const result = await response.json(); // Obtener la respuesta de la API        

                localStorage.setItem("token", result.token); // Guardar el token en el almacenamiento local
                // Mensaje de éxito para el usuario logueado
                Swal.fire({
                    title: 'Usuario logueado',
                    text: 'Bienvenido ' + data.email,
                    icon: 'success',
                    background: '#f1f1f1',
                    color:  '#000000',
                    confirmButtonColor: '#2512cf',
                    confirmButtonText: 'Aceptar'
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "index.html"; // Redirigir a la página principal luego de Aceptar
                        }
                    });

            } else {
                Swal.fire({
                    title: "Login Fallido",
                    text: "Por favor verifique su usuario y contraseña.",
                    icon: 'error',
                    background: '#f1f1f1',
                    color: '#000000',
                    confirmButtonColor: '#2512cf',
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    }
}