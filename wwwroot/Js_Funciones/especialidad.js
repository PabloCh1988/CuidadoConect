async function ObtenerEspecialidades() {
    try {
        const data = await authFetch("especialidades");
        $("#todosLasEpecialidades").empty();

        $.each(data, function (index, especialidad) {
            $("#todosLasEpecialidades").append(
                `<tr id="fila-${especialidad.id}">
          <td id="desc-${especialidad.id}">${especialidad.nombreEspecialidad}</td>
          <td>
            <button class='btn btn-outline-success fa fa-pencil' 
                    title='Editar' 
                    onclick='activarEdicionEspecialidad(${especialidad.id}, "${especialidad.nombreEspecialidad}")'></button>
            <button class='btn btn-outline-danger fa fa-times' 
                    title='Eliminar' 
                    onclick='EliminarEspecialidad(${especialidad.id})'></button>
          </td>
        </tr>`
            );
        });
    } catch (err) {
        console.error("Error en ObtenerEspecialidades:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error al obtener especialidades',
            text: err.message,
        });
    }
}

function activarEdicionEspecialidad(id, descripcionActual) {
    const celda = document.getElementById(`desc-${id}`);
    if (celda.querySelector("input")) return;

    const input = document.createElement("input");
    input.type = "text";
    input.value = descripcionActual;
    input.className = "form-control";
    input.id = `input-${id}`;
    input.style.width = "100%";

    const btnGuardar = document.createElement("button");
    btnGuardar.className = "btn btn-primary btn-sm me-1 mt-2";
    btnGuardar.innerHTML = '<i class="fa fa-check"></i>';
    btnGuardar.onclick = function () {
        const nuevoValor = input.value.trim(); // elimina espacios
        if (nuevoValor === "") {
            Swal.fire({
                icon: "warning",
                title: "Campo vacío",
                text: "El nombre de la especialidad no puede estar vacío.",
            });
            input.focus();
            return; // evita seguir
        }
        guardarEdicionEspecialidad(id);
    };

    const btnCancelar = document.createElement("button");
    btnCancelar.className = "btn btn-danger btn-sm mt-2";
    btnCancelar.innerHTML = '<i class="fa fa-times"></i>';
    btnCancelar.onclick = function () {
        cancelarEdicionEspecialidad(id, descripcionActual);
    };

    celda.innerHTML = "";
    celda.appendChild(input);
    celda.appendChild(btnGuardar);
    celda.appendChild(btnCancelar);

    input.focus();
}

async function guardarEdicionEspecialidad(id) {
    const nuevaDescripcion = document.getElementById(`input-${id}`).value;

    try {
        await authFetch(`especialidades/${id}`, {
            method: "PUT",
            body: JSON.stringify({ id: id, nombreEspecialidad: nuevaDescripcion }),
        });

        Swal.fire({
            icon: "success",
            title: "Especialidad actualizada",
            showConfirmButton: false,
            timer: 1200,
        });

        document.getElementById(`desc-${id}`).innerText = nuevaDescripcion;
    } catch (err) {
        Swal.fire("Error al editar especialidad", err.message, "error");
    }
}

function cancelarEdicionEspecialidad(id, descripcionOriginal) {
    document.getElementById(`desc-${id}`).innerText = descripcionOriginal;
}


async function GuardarEspecialidad() {
    const nombre = document.getElementById("NombreEspecialidad").value;
    if (!nombre) {
        mensajesError('#errorCrearEspecialidad', null, "El nombre de la especialidad es obligatorio");
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
            showConfirmButton: false,
            timer: 1500
        });
    } catch (err) {
        console.error("Error al crear la especialidad:", err);
        mensajesError('#errorCrearEspecialidad', null, `Error al crear: ${err.message}`);
    }
}

function LimpiarModalEspecilialidad() {
    document.getElementById("NombreEspecialidad").value = "";
    $('#errorCrearEspecialidad').empty();
}

function EliminarEspecialidad(id) {
    Swal.fire({
        title: "Estas seguro de eliminar esta especialidad?",
        text: "¡No podrás revertir esto!",
        icon: 'warning',
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
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.error("Error al actualizar la especialidad:", error);
        mensajesError('#errorEditarEspecialidad', null, `Error al actualizar: ${error.message}`);
    }
}