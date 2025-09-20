// API_Especialidad = "https://localhost:7233/api/especialidades";

async function ObtenerEspecialidades() {
    try {
        const data = await authFetch("especialidades");
        $("#todosLasEpecialidades").empty(); // Limpiar la tabla antes de mostrar los datos
        $.each(data, function (index, especialidad) {
            $("#todosLasEpecialidades").append(
                "<tr>" +
                "<td>" + especialidad.nombreEspecialidad + "</td>" +
                "<td><button class='btn btn-outline-success fa fa-pencil' title='Editar' onclick='EditarEspecialidad(" + especialidad.id + ")'></button> <button class='btn btn-outline-danger fa fa-times' title='Eliminar' onclick='EliminarEspecialidad(" + especialidad.id + ")'></button></td>" +
                "</tr>"
            );

        });
    } catch (err) {
        console.error("Error en ObtenerEspecialidades:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error al obtener especialidades',
            text: err.message,
            background: '#1295c9',
            color: '#f1f1f1'
        });
    }
}

async function GuardarEspecialidad() {
    const nombre = document.getElementById("NombreEspecialidad").value;
    if (!nombre) {
        mensajesError('#errorCrear', null, "El nombre de la especialidad es obligatorio");
        return;
    }
    const especialidad = {
        nombreEspecialidad: nombre
    };
    try {
        const data = await authFetch("especialidades", {
            method: "POST",
            body: JSON.stringify(especialidad)
        });
        $("#ModalCrearEspecialidadess").modal("hide"); // Cerrar el modal
        ObtenerEspecialidades(); // Actualizar la lista de especialidades
        document.getElementById("NombreEspecialidad").value = ""; // Limpiar el campo
        Swal.fire({
            icon: "success",
            title: "Especialidad creada correctamente",
            background: '#1295c9',
            color: '#f1f1f1',
            showConfirmButton: false,
            timer: 1500
        });
    } catch (err) {
        console.error("Error al crear la especialidad:", err);
        mensajesError('#errorCrearEspecialidad', null, `Error al crear: ${err.message}`);
    }
}

function EliminarEspecialidad(id) {
    Swal.fire({
        title: "Estas seguro de eliminar esta especialidad?",
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        background: '#1295c9',
        color: '#f1f1f1',
        showCancelButton: true,
        confirmButtonColor: '#0005d1',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarla'

    }).then(async (result) => {
        if (result.isConfirmed) {
            await EliminarEspecialidadSi(id);
        }
    });

    async function EliminarEspecialidadSi(id) {
        authFetch(`especialidades/${id}`, { method: "DELETE", })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Especialidad eliminada correctamente',
                    background: '#1295c9',
                    color: '#f1f1f1',
                    showConfirmButton: false,
                    timer: 1500
                });
                ObtenerEspecialidades(); // Actualizar la lista de especialidades
            })
            .catch(async (error) => console.error("Error al eliminar la especialidad:", error));
    }
}

function EditarEspecialidad(id) {
    authFetch(`especialidades/${id}`, { method: "GET" })
        .then(data => {
            document.getElementById("NombreEspecialidadEditar").value = data.nombreEspecialidad;
            document.getElementById("EspecialidadIdEditar").value = data.id;
            $('#ModalEditarEspecialidad').modal('show'); // Mostrar el modal de edición
            console.log("Especialidad a editar:", data);
        })
        .catch(error => {
            console.error("Error al obtener la especialidad:", error);
            alert("Error al obtener la especialidad: " + error.message);
        });
}

async function ActualizarEspecialidad() {
    const especialidadId = document.getElementById("EspecialidadIdEditar").value;
    const nombre = document.getElementById("NombreEspecialidadEditar").value;
    if (!nombre) {
        mensajesError('#errorEditar', null, "El nombre de la especialidad es obligatorio");
        return;
    }
    const especialidad = {
        id: especialidadId,
        nombreEspecialidad: nombre
    };
    try {
        await authFetch(`especialidades/${especialidadId}`, {
            method: "PUT",
            body: JSON.stringify(especialidad)
        });
        $("#ModalEditarEspecialidad").modal("hide"); // Cerrar el modal
        ObtenerEspecialidades(); // Actualizar la lista de especialidades
        Swal.fire({
            icon: "success",
            title: "Especialidad actualizada correctamente",
            background: '#1295c9',
            color: '#f1f1f1',
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.error("Error al actualizar la especialidad:", error);
        mensajesError('#errorEditarEspecialidad', null, `Error al actualizar: ${error.message}`);
    }
}