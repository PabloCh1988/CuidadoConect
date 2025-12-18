// FUNCION PARA MOSTRAR TOTAL DE EMPLEADOS EN ESCRITORIO
async function mostrarTotalEmpleados() {
    try {
        const emple = await authFetch(`empleados`);

        const total = emple.length;
        document.getElementById('total-empleados').textContent = total;
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        document.getElementById('total-empleados').textContent = 'Error';
    }
}

async function ObtenerEmpleados() {
    try {
        const data = await authFetch("empleados");

        $("#todosLosEmpleados").empty();
        $("#cardsContainerEmpleados").empty();

        $.each(data, function (index, empleado) {
            // --- Fila de la tabla ---
            $("#todosLosEmpleados").append(`
                <tr>
                    <td>${empleado.persona.nombreyApellido}</td>
                    <td>${empleado.email}</td>
                    <td>${empleado.turno}</td>
                    <td><button class="btn btn-outline-primary fa fa-pencil" title="Editar" onclick="EditarTurno(${empleado.id})"></button></td>
                    <td>${empleado.tareasAsignadas}</td>
                </tr>
            `);

            // --- Card para móvil ---
            $("#cardsContainerEmpleados").append(`
                <div class="col-12">
                    <div class="card shadow-sm p-3 mb-2">
                        <h5 class="card-title mb-1">${empleado.persona.nombreyApellido}</h5>
                        <p class="mb-1"><strong>Email:</strong> ${empleado.email}</p>
                        <p class="mb-1"><strong>Turno:</strong> ${empleado.turno}</p>
                        <p class="mb-1"><strong>Tareas:</strong> ${empleado.tareasAsignadas}</p>
                        <div class="mt-2 d-flex justify-content-between">
                            <button class="btn btn-outline-success fa fa-pencil" title="Editar" onclick="EditarTurno(${empleado.id})"></button>
                        </div>
                    </div>
                </div>
            `);
        });
    } catch (err) {
        console.error("Error en ObtenerEmpleados:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error al obtener empleados',
            text: err.message,
        });
    }
}


async function CrearEmpleado() {
    const turno = parseInt(document.getElementById("turno").value);
    const tareasAsignadas = document.getElementById("tareasAsignadas").value;
    const personaId = $('#formEmpleado').data('PersonaId');
    const emailempleado = document.getElementById("EmailEmpleado").value;

    if (isNaN(personaId)) {
        mensajesError('#errorCrearEmpleado', null, "Debes seleccionar una persona válida");
        return;
    }
    if (!emailempleado || emailempleado.trim() === "") {
        mensajesError('#errorCrearEmpleado', null, "El email es obligatorio");
        return;
    }
    if (!emailempleado.includes("@")) {
        mensajesError('#errorCrearEmpleado', null, "Ingrese un email válido");
        return;
    }
    if (!turno || !tareasAsignadas) {
        mensajesError('#errorCrearEmpleado', null, "Todos los campos son obligatorios");
        return;
    }

    const empleado = {
        email: emailempleado,
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
        document.getElementById("EmailEmpleado").value = "";
        
        // ===== ACTUALIZACIÓN VISUAL DE LA TABLA =====

        // Busca la fila de la tabla donde el primer <td> coincida con personaId
        const fila = $(`#todasLasPersonas tr`).filter(function () {
            return $(this).find("td:first").text() == personaId;
        });
        // Reemplaza el contenido de la columna 7 (índice 6)
        // Normalmente ahí estaba el <select>, ahora muestra "Empleado"
        fila.find("td:eq(6)").html("Empleado"); // Columna del select

        Swal.fire({
            icon: "success",
            title: "Empleado creado correctamente",
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
            $('#EmailEditar').val(data.email)
            // Mostrar el modal
            $('#modalEditarTurno').modal('show');
        }).catch(error => {
            console.error("Error al obtener el empleado:", error);
            alert("Error al obtener el empleado: " + error.message);
        });
}
// async function EditarTurnoSI() {
//     const empleadoId = $('#EmpleadoId').val();
//     const turno = document.getElementById("turnoEditar").value;
//     const tareasAsignadas = document.getElementById("tareasAsignadasEditar").value;
//     const personaId = parseInt(document.getElementById("PersonaId").value);
//     const emailempleado = document.getElementById("EmailEditar");

//     if (isNaN(empleadoId)) {
//         mensajesError('#errorCrear', null, "Debes seleccionar un empleado válido");
//         return;
//     }

//     const empleado = {
//         id: empleadoId,
//         turno: turno,
//         tareasAsignadas: tareasAsignadas,
//         personaId: personaId,
//         email: emailempleado.value, // tomar el value
//     };

//     try {
//         await authFetch(`empleados/${empleadoId}`, {
//             method: "PUT",
//             body: JSON.stringify(empleado)
//         });

//         $('#modalEditarTurno').modal('hide');
//         ObtenerEmpleados();

//         Swal.fire({
//             icon: "success",
//             title: "Empleado editado correctamente",
//             showConfirmButton: false,
//             timer: 1500
//         });
//     } catch (error) {
//         console.error("Error al editar el empleado:", error);

//         if (error.status === 401 || error.status === 403) {
//             console.error("Error al obtener citas del profesional:", err);
//             Swal.fire({
//                 title: "Acceso Denegado",
//                 text: "No tienes permisos para realizar esta acción.",
//                 icon: "error",
//                 confirmButtonText: "Aceptar"
//             }).then(() => {
//                 // Redirección al index.html después de cerrar el Swal
//                 window.location.href = "index.html";
//             });
//         } else if (error.status === 400) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: "Datos inválidos. Revisa los campos e intenta nuevamente.",
//             });
//         } else {
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: error.message || "Ocurrió un error inesperado",
//             });
//         }
//     }
// }

async function EditarTurnoSI() {
    const empleadoId = parseInt($('#EmpleadoId').val());
    const turno = document.getElementById("turnoEditar").value;
    const tareasAsignadas = document.getElementById("tareasAsignadasEditar").value;
    const personaId = parseInt(document.getElementById("PersonaId").value);
    const emailempleado = document.getElementById("EmailEditar").value;

    if (isNaN(empleadoId)) {
        mensajesError('#errorCrear', null, "Debes seleccionar un empleado válido");
        return;
    }

    const empleado = {
        id: empleadoId,
        turno,
        tareasAsignadas,
        personaId,
        email: emailempleado
    };

    try {
        await authFetch(`empleados/${empleadoId}`, {
            method: "PUT",
            body: JSON.stringify(empleado)
        });

        $('#modalEditarTurno').modal('hide');
        ObtenerEmpleados();

        Swal.fire({
            icon: "success",
            title: "Empleado editado correctamente",
            showConfirmButton: false,
            timer: 1500
        });

    } catch (error) {
        console.error("Error al editar el empleado:", error);

        if (error.status === 401 || error.status === 403) {
            Swal.fire({
                title: "Acceso Denegado",
                text: "No tienes permisos para realizar esta acción.",
                icon: "error",
                confirmButtonText: "Aceptar"
            }).then(() => {
                window.location.href = "index.html";
            });

        } else if (error.status === 400) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Datos inválidos. Revisa los campos."
            });

        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Ocurrió un error inesperado"
            });
        }
    }
}


ObtenerEmpleados();