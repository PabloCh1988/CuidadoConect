let API_Empleados = "https://localhost:7233/api/empleados";

async function ObtenerEmpleados() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
    fetch(API_Empleados, { headers: authHeaders() })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los empleados");
            }
            return response.json();
        })
        .then(data => {
            MostrarEmpleados(data); // Llamar a la función para mostrar los clientes
        })
        .catch(error => {
            console.error("Error al obtener los empleados:", error);
            alert("Error al obtener los empleados: " + error.message);
        });
}

function MostrarEmpleados(data) {
    $("#todosLosEmpleados").empty(); // Limpiar la tabla antes de mostrar los datos
    $.each(data, function (index, empleado) {
        $("#todosLosEmpleados").append(
            "<tr>" +
            "<td>" + empleado.persona.nombreyApellido + "</td>" +
            "<td>" + empleado.turno + "</td>" +
            "<td><button class='btn btn-outline-success fa fa-pencil' title='Editar' onclick='EditarTurno(" + empleado.id + ")'></button></td>" +
            "<td>" + empleado.tareasAsignadas + "</td>" +
            "<td><button class='btn btn-outline-danger fa fa-times' onclick='EliminarEmpleado(" + empleado.id + ")'></button></td>" +
            "</tr>"
        );
    });
}
async function CrearEmpleado() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación

    const turno = parseInt(document.getElementById("turno").value);
    const tareasAsignadas = document.getElementById("tareasAsignadas").value;
    const personaId = $('#formEmpleado').data('PersonaId');

    if (isNaN(personaId)) {
        mensajesError('#errorCrear', null, "Debes seleccionar una persona válida");
        return;
    }


    const empleado = {
        turno: turno,
        tareasAsignadas: tareasAsignadas,
        personaId: personaId,

    };

    const res = await fetch(API_Empleados, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(empleado)
    })

    if (res.ok) {
        const data = await res.json();
        $("#modalEmpleado").modal("hide");
        ObtenerEmpleados();
        VaciarModal();
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
    }

    else {
        const errorText = await res.text();
        console.log("Error al crear el empleado:", errorText);
        mensajesError('#errorCrearEmpleado', null, `Error al crear: ${errorText}`);
    }
    console.log(empleado)
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
            const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
            const authHeaders = () => ({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }); // Configurar los headers de autenticación

            const res = await fetch(`${API_Empleados}/${id}`, {
                method: "DELETE",
                headers: authHeaders()
            });

            if (res.ok) {
                ObtenerEmpleados(); // Actualizar la lista de empleados
                Swal.fire({
                    icon: 'success',
                    title: 'Empleado eliminado correctamente',
                    background: '#1295c9',
                    color: '#f1f1f1',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                const errorText = await res.text();
                console.error("Error al eliminar el empleado:", errorText);
                mensajesError('#errorCrear', null, `Error al eliminar: ${errorText}`);
            }
        }
    });
}

function EditarTurno(id) {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
    fetch(`${API_Empleados}/${id}`, { headers: authHeaders(), method: "GET", })
        .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener el empleado");
        }
        return response.json();
    })
    .then(data => {
        // Rellenar los campos del modal con los datos del empleado
        $('#EmpleadoId').val(data.id);
        $('#PersonaId').val(data.personaId);
        $('#turnoEditar').val(data.turno);
        $('#tareasAsignadasEditar').val(data.tareasAsignadas);
        // Mostrar el modal
        $('#modalEditarTurno').modal('show');
    })
    .catch(error => {
        console.error("Error al obtener el empleado:", error);
        alert("Error al obtener el empleado: " + error.message);
    });
}
function EditarTurnoSI() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
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
    fetch(`${API_Empleados}/${empleadoId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(empleado)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al editar el empleado");
            }
            return response.json();
        })
        .then(data => {
            $('#modalEditarTurno').modal('hide');
            ObtenerEmpleados(); // Actualizar la lista de empleados
            // VaciarModal();
            Swal.fire({
                icon: "success",
                title: "Empleado editado correctamente",
                background: '#1295c9',
                color: '#f1f1f1',
                showConfirmButton: false,
                timer: 1500
            });
        })
        .catch(error => {
            console.error("Error al editar el empleado:", error);
            alert("Error al editar el empleado: " + error.message);
        });
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