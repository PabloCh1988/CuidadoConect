// API_Profesional = "https://localhost:7233/api/profesionales";

// function ObtenerProfesionales() {
//     const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
//     const authHeaders = () => ({
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${getToken()}`
//     }); // Configurar los headers de autenticación
//     fetch(API_Profesional, { headers: authHeaders() })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Error al obtener los profesionales");
//             }
//             return response.json();
//         })
//         .then(data => {
//             MostrarProfesionales(data); // Llamar a la función para mostrar los profesionales
//         })
//         .catch(error => {
//             console.error("Error al obtener los profesionales:", error);
//             alert("Error al obtener los profesionales: " + error.message);
//         });
// }
async function ObtenerProfesionales() {
    try {
        const data = await authFetch("profesionales"); // 👈 ya devuelve JSON
        $("#todosLosProfesionales").empty(); // Limpiar la tabla antes de mostrar los datos
        $.each(data, function (index, profesional) {
            $("#todosLosProfesionales").append(
                "<tr>" +
                "<td>" + profesional.persona.nombreyApellido + "</td>" +
                "<td>" + profesional.especialidad.nombreEspecialidad + "</td>" +
                "<td><button class='btn btn-outline-danger fa fa-times' title='Eliminar' onclick='EliminarProfesional(" + profesional.id + ")'></button></td>" +
                "</tr>"
            );
        });
    } catch (err) {
        console.error("Error en ObtenerProfesionales:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error al obtener profesionales',
            text: err.message,
            background: '#1295c9',
            color: '#f1f1f1'
        });
    }
}

async function CrearProfesional() {
    const personaId = $('#formProfesional').data('PersonaId');
    const especialidadId = parseInt(document.getElementById("EspecialidadId").value);
    if (isNaN(personaId)) {
        mensajesError('#errorCrear', null, "Debes seleccionar una persona válida");
        return;
    }
    if (isNaN(especialidadId)) {
        mensajesError('#errorCrear', null, "Debes seleccionar una especialidad válida");
        return;
    }
    const profesional = {
        personaId: personaId,
        especialidadId: especialidadId
    };
    try {
        const data = await authFetch("profesionales", {
            method: "POST",
            body: JSON.stringify(profesional)
        });
        $('#modalProfesional').modal('hide');
        ObtenerPersonas(); // Actualizar la lista de personas
        document.getElementById("EspecialidadId").value = ""; // Limpiar el select de especialidades
        console.log("Profesional guardado:", data);

        Swal.fire({
            icon: "success",
            title: "Profesional creado correctamente",
            background: '#1295c9',
            color: '#f1f1f1',
            showConfirmButton: false,
            timer: 1500
        });
    } catch (err) {
        console.log("Error al crear el profesional:", err);
        mensajesError('#errorCrear', null, `Error al crear: ${err.message}`);
    }
}

function EliminarProfesional(id) {
    Swal.fire({
        title: "Estas seguro de eliminar este profesional?",
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        background: '#1295c9',
        color: '#f1f1f1',
        showCancelButton: true,
        confirmButtonColor: '#0005d1',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'

    }).then(async (result) => {
        if (result.isConfirmed) {
            await EliminarProfesionalSi(id);
        }
    });
}

async function EliminarProfesionalSi(id) {
    authFetch(`profesionales/${id}`, { method: "DELETE" })
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Profesional eliminado correctamente",
                background: '#1295c9',
                color: '#f1f1f1',
                showConfirmButton: false,
                timer: 1500
            });
            ObtenerProfesionales();
        })
        .catch(async (err) => console.error("Error al eliminar el profesional:", err));
}