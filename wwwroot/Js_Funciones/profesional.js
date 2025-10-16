
async function ObtenerProfesionales() {
    try {
        const data = await authFetch("profesionales"); // 👈 ya devuelve JSON
        $("#todosLosProfesionales").empty(); // Limpiar la tabla antes de mostrar los datos
        $.each(data, function (index, profesional) {
            $("#todosLosProfesionales").append(
                "<tr>" +
                "<td>" + profesional.persona.nombreyApellido + "</td>" +
                "<td>" + profesional.especialidad.nombreEspecialidad + "</td>" +
                "<td>" + profesional.email + "</td>" +
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
        mensajesError('#errorCrearProfesional', null, "Debes seleccionar una persona válida");
        return;
    }
    if (!especialidadId) {
        mensajesError('#errorCrearProfesional', null, "Debes seleccionar una especialidad");
        return;
    }
    const profesional = {
        personaId: personaId,
        especialidadId: especialidadId,
        email: document.getElementById("EmailProfesional").value
    };
    if (!profesional.email || profesional.email.trim() === "") {
        mensajesError('#errorCrearProfesional', null, "El email es obligatorio");
        return;
    }
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

        if (err.status === 403) {
            mensajesError('#errorCrearProfesional', null, "No tienes permisos para crear profesionales. Solo el administrador puede realizar esta acción.");
        } else {
            mensajesError('#errorCrearProfesional', null, `Error al crear: ${err.message}`);
        }
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
        .catch(async (err) =>
            console.error("Error al eliminar el profesional:", err));
}