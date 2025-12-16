
const Base_API_URL = "https://localhost:7233/api/";

// Login sin token, usando cookies
function login(email, password) {
    return fetch(Base_API_URL + "auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include", // esto permite que se envíen y reciban cookies
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (!response.ok) throw new Error("Login fallido");
            return response.text(); // o .json() si el backend devuelve algo
        });
}

// Logout usando cookies
function logout() {
    return fetch(Base_API_URL + "auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al cerrar sesión");
            return response.json();
        })
        .then(data => {
            console.log(data.mensaje); // opcional
            window.location.href = "login.html"; // redirige al login
        })
        .catch(error => {
            mensajesError("#errorLogout", null, error.message);
        });
}

// Peticiones autenticadas (ya no se usa token)
function authFetch(url, options) {
    options = options || {};
    options.headers = options.headers || {};
    options.credentials = "include"; // esto es clave para mantener la sesión

    if (!(options.body instanceof FormData)) {
        options.headers["Content-Type"] = "application/json";
    }

    return fetch(Base_API_URL + url, options)
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                const error = new Error(errorText || "Error en la solicitud");
                error.status = response.status; // Esto es clave
                throw error;
            }
            return response.status === 204 ? null : response.json();
        });
}


function mensajesError(id, data, mensaje) {
    const contenedor = $(id);
    contenedor.empty();

    let htmlErrores = "<div>";

    if (data && data.errors) {
        $.each(data.errors, function (key, items) {
            $.each(items, function (_, item) {
                htmlErrores += `<div>• ${item}</div>`;
            });
        });
    } else if (mensaje) {
        htmlErrores += `<div>${mensaje}</div>`;
    }

    htmlErrores += "</div>";

    contenedor.html(htmlErrores);

    // Esto sí muestra correctamente (no deja el atributo hidden)
    contenedor.removeAttr("hidden");
}
