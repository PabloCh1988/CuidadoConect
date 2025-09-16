// let API_Empleados = "https://localhost:7233/api/empleados";

async function ObtenerEmpleados() {
    try {
        const data = await authFetch("empleados"); // 👈 ya devuelve JSON
        $("#todosLosEmpleados").empty();
        $.each(data, function (index, empleado) {
            $("#todosLosEmpleados").append(
                "<tr>" +
                "<td>" + empleado.persona.nombreyApellido + "</td>" +
                "<td>" + empleado.email + "</td>" +
                "<td>" + empleado.turno + "</td>" +
                "<td><button class='btn btn-outline-success fa fa-pencil' title='Editar' onclick='EditarTurno(" + empleado.id + ")'></button></td>" +
                "<td>" + empleado.tareasAsignadas + "</td>" +
                "<td><button class='btn btn-outline-danger fa fa-times' onclick='EliminarEmpleado(" + empleado.id + ")'></button></td>" +
                "</tr>"
            );
        });
    } catch (err) {
        console.error("Error en ObtenerEmpleados:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error al obtener empleados',
            text: err.message,
            background: '#1295c9',
            color: '#f1f1f1'
        });
    }
}

async function CrearEmpleado() {
    const turno = parseInt(document.getElementById("turno").value);
    const tareasAsignadas = document.getElementById("tareasAsignadas").value;
    const personaId = $('#formEmpleado').data('PersonaId');

    if (isNaN(personaId)) {
        mensajesError('#errorCrear', null, "Debes seleccionar una persona válida");
        return;
    }

    const empleado = {
        email: document.getElementById("EmailEmpleado").value,
        turno: turno,
        tareasAsignadas: tareasAsignadas,
        personaId: personaId,
    };

    try {
        const data = await authFetch("empleados", {
            method: "POST",
            body: JSON.stringify(empleado)
        });

        $("#modalEmpleado").modal("hide");
        ObtenerPersonas();
        document.getElementById("turno").value = "";
        document.getElementById("tareasAsignadas").value = "";
        console.log("Empleado guardado:", data);

        // 🔥 Actualizar la tabla: quitar el select y mostrar "Empleado"
        const fila = $(`#todasLasPersonas tr`).filter(function () {
            return $(this).find("td:first").text() == personaId;
        });
        fila.find("td:eq(6)").html("Empleado"); // Columna del select

        Swal.fire({
            icon: "success",
            title: "Empleado creado correctamente",
            background: '#1295c9',
            color: '#f1f1f1',
            showConfirmButton: false,
            timer: 1500
        });
    } catch (err) {
        console.log("Error al crear el empleado:", err);
        mensajesError('#errorCrearEmpleado', null, `Error al crear: ${err.message}`);
    }
}


function EliminarEmpleado(id) {
    Swal.fire({
        title: "Estas seguro de eliminar este empleado?",
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
            await EliminarEmpleadoSi(id);
        }
    });
}

async function EliminarEmpleadoSi(id) {
    authFetch(`empleados/${id}`, { method: "DELETE" })
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Empleado eliminado correctamente',
                background: '#1295c9',
                color: '#f1f1f1',
                showConfirmButton: false,
                timer: 1500
            });
            ObtenerEmpleados();
        })
        .catch(async (error) => console.error("Error al eliminar el empleado:", error));
}


function EditarTurno(id) {
    authFetch(`empleados/${id}`, {
        method: "GET",
    })
        .then(data => {
            // Rellenar los campos del modal con los datos del empleado
            $('#EmpleadoId').val(data.id);
            $('#PersonaId').val(data.personaId);
            $('#turnoEditar').val(data.turno);
            $('#tareasAsignadasEditar').val(data.tareasAsignadas);
            // Mostrar el modal
            $('#modalEditarTurno').modal('show');
        }).catch(error => {
            console.error("Error al obtener el empleado:", error);
            alert("Error al obtener el empleado: " + error.message);
        });
}

async function EditarTurnoSI() {
    const empleadoId = $('#EmpleadoId').val();
    const turno = document.getElementById("turnoEditar").value;
    const tareasAsignadas = document.getElementById("tareasAsignadasEditar").value;
    const personaId = parseInt(document.getElementById("PersonaId").value);
    if (isNaN(empleadoId)) {
        mensajesError('#errorCrear', null, "Debes seleccionar un empleado válido");
        return;
    }
    const empleado = {
        id: empleadoId,
        turno: turno,
        tareasAsignadas: tareasAsignadas,
        personaId: personaId,
    };
    try {
        await authFetch(`empleados/${empleadoId}`, {
            method: "PUT",
            body: JSON.stringify(empleado)
        });
        $('#modalEditarTurno').modal('hide');
        ObtenerEmpleados(); // Actualizar la lista de empleados
        Swal.fire({
            icon: "success",
            title: "Empleado editado correctamente",
            background: '#1295c9',
            color: '#f1f1f1',
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.error("Error al editar el empleado:", error);
        mensajesError('#errorEditar', null, `Error al editar: ${error.message}`);
    }
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

ObtenerEmpleados();