API_Personas = "https://localhost:7233/api/personas";

async function ObtenerPersonas() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
    fetch(API_Personas, { headers: authHeaders() })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener las personas");
            }
            return response.json();
        })
        .then(data => {
            MostrarPersonas(data); // Llamar a la función para mostrar los clientes
        })
        .catch(error => {
            console.error("Error al obtener las personas:", error);
            alert("Error al obtener las personas: " + error.message);
        });
}

function MostrarPersonas(data) {
    $("#todasLasPersonas").empty(); // Limpiar la tabla antes de mostrar los datos
    $.each(data, function (index, persona) {
        $("#todasLasPersonas").append(
            "<tr>" +
            "<td>" + persona.id + "</td>" +
            "<td>" + persona.nombreyApellido + "</td>" +
            "<td>" + formatearFecha(persona.fechaNacimiento) + "</td>" +
            "<td>" + persona.sexo + "</td>" +
            "<td>" + persona.dni + "</td>" +
            "<td>" + persona.telefono + "</td>" +
            "<td><button class='btn btn-outline-danger fa fa-times' onclick='EliminarPersona(" + persona.id + ")'></button></td>" +
            "</tr>"
        );
    });
}

function formatearFecha(fecha) {
    if (!fecha) return "";
    // Convierte la fecha a objeto Date
    const d = new Date(fecha);
    // Si la fecha no es válida, retorna el string original
    if (isNaN(d.getTime())) return fecha;
    // Formato: dd/mm/yyyy
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();

    return `${dia}/${mes}/${anio}`;
}


async function guardarPersona() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage

    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación

    const crearPersona = {
        nombreyApellido: document.getElementById("Nombre").value,
        fechaNacimiento: document.getElementById("Fecha").value,
        sexo: document.getElementById("Sexo").value,
        dni: document.getElementById("DNI").value,
        telefono: document.getElementById("Telefono").value,
    }
    if (crearPersona.dni.length <= 6) {
        mensajesError('#errorCrear', null, "El DNI debe tener más de 6 caracteres");
        return;
    
    }
    const res = await fetch(API_Personas, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(crearPersona)
    });
    if (res.ok) {
        const data = await res.json();
        $("#ModalCrearPersonas").modal("hide"); // Cerrar el modal después de guardar
        ObtenerPersonas(); // Actualizar la lista de personas
        VaciarModal(); // Llamar a la función para vaciar el modal
        
        
        // Aquí puedes manejar la respuesta del servidor
        console.log("Persona guardada:", data);
        Swal.fire({
            icon: "success",
            title: "Persona creada correctamente",
            background: '#1295c9',
            color: '#f1f1f1',
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        const errorText = await res.text();
        console.log("Error al crear la persona:", errorText);
        mensajesError('#errorCrear', null, `Error al crear: ${errorText}`);
    }
}

function VaciarModal() {
    document.getElementById("Nombre").value = "";
    document.getElementById("Fecha").value = "";
    document.getElementById("Sexo").value = "";
    document.getElementById("DNI").value = "";
    document.getElementById("Telefono").value = "";
    $("#errorCrear").empty();
}

function EliminarPersona(id) {
    Swal.fire({
        title: "Estas seguro de eliminar esta persona?",
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        background: '#1295c9',
        color: '#f1f1f1',
        showCancelButton: true,
        confirmButtonColor: '#0005d1',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarla'

    }).then((result) => {
        if (result.isConfirmed) {
            EliminarPersonaSi(id);
        }
    });
}

function EliminarPersonaSi(id) {
        const getToken = () => localStorage.getItem("token");
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
    }); // Configurar los headers de autenticación

    fetch(`${API_Personas}/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    })
        .then(() => {
            // Mostrar mensaje de éxito
            Swal.fire({
                title: "Eliminado!",
                text: "La persona ha sido eliminada.",
                icon: 'success',
                background: '#1295c9',
                color: '#f1f1f1',
                showConfirmButton: false,
                timer: 1500
            });
            ObtenerPersonas(); // Actualiza la lista de personas
        })
        .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error))
}








function mensajesError(id, data, mensaje) {
    $(id).empty();
    if (data != null) {
        $.each(data.errors, function (index, item) {
            $(id).append(
                "<ol>",
                "<li>" + item + "</li>",
                "</ol>"
            )
        })
    }
    else {
        $(id).append(
            "<ol>",
            "<li>" + mensaje + "</li>",
            "</ol>"
        )
    }
    $(id).attr("hidden", false);
}