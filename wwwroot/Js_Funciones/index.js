async function ObtenerPersonas() {
    try {
        const data = await authFetch("personas"); // 👈 ya devuelve JSON

        $("#todasLasPersonas").empty();
        $("#cardsContainerPersonas").empty();
        $.each(data, function (index, persona) {
            let rolHtml = "";

            if (persona.rol && persona.rol !== "") {
                rolHtml = persona.rol;
            } else {
                rolHtml =
                    "<select class='form-select form-select-sm btn cur-p btn-outline-success dropdown-toggle' data-toggle='dropdown' onchange='abrirModal(" + persona.id + ", this.value)'>" +
                    "<option value='' selected disabled>Asignar Rol</option>" +
                    "<option class='dropdown-item' value='Profesional'>Profesional</option>" +
                    "<option class='dropdown-item' value='Residente'>Residente</option>" +
                    "<option class='dropdown-item' value='Empleado'>Empleado</option>" +
                    "</select>";
            }

            $("#todasLasPersonas").append(
                "<tr>" +
                "<td>" + persona.nombreyApellido + "</td>" +
                "<td>" + formatearFecha(persona.fechaNacimiento) + "</td>" +
                "<td>" + persona.sexo + "</td>" +
                "<td>" + persona.dni + "</td>" +
                "<td>" + persona.telefono + "</td>" +
                "<td>" + rolHtml + "</td>" +
                "<td><button class='btn btn-outline-success fa fa-pencil' title='Editar' onclick='EditarPersona(" + persona.id + ")'></button></td>" +
                "<td><button class='btn btn-outline-danger fa fa-times' title='Eliminar' onclick='EliminarPersona(" + persona.id + ")'></button></td>" +
                "</tr>"
            );

            $("#cardsContainerPersonas").append(`
                <div class="col-12">
                    <div class="card shadow-sm p-3 mb-2">
                        <h5 class="card-title mb-1">${persona.nombreyApellido}</h5>
                        <p class="mb-1"><strong>Fecha de Nacimiento:</strong> ${formatearFecha(persona.fechaNacimiento)}</p>
                        <p class="mb-1"><strong>Sexo:</strong> ${persona.sexo}</p>
                        <p class="mb-1"><strong>D.N.I.:</strong> ${persona.dni}</p>
                        <p class="mb-1"><strong>Teléfono:</strong> ${persona.telefono}</p>
                        <div><p class="mb-1"><strong>Rol:</strong> ${rolHtml}</p></div>
                        <div class="mt-2 d-flex justify-content-between">
                            <button class="btn btn-outline-success fa fa-pencil" title="Editar" onclick="EditarPersona(${persona.id})"></button>
                            <button class="btn btn-outline-danger fa fa-times" title="Eliminar" onclick="EliminarPersona(${persona.id})"></button>
                        </div>
                    </div>
                </div>
        `)
        });
    } catch (err) {
        console.error("Error en ObtenerPersonas:", err);
    }
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

function abrirModal(personaId, rol) {
    // Abre el modal correspondiente según el rol seleccionado
    if (rol === 'Empleado') {
        $('#modalEmpleado').modal('show');
        // Guarda el ID de la persona en el modal para usarlo al guardar
        $('#formEmpleado').data('PersonaId', personaId);
    }
    else if (rol === 'Profesional') {
        $('#modalProfesional').modal('show');
        // Carga las especialidades en el dropdown
        ObtenerEspecialidadesDrop();
        $('#formProfesional').data('PersonaId', personaId);
    }
    else if (rol === 'Residente') {
        $('#modalResidente').modal('show');
        $('#formResidente')
            .data('PersonaId', personaId)

        console.log("Rol recibido:", rol);
        $('#modalResidente').on('shown.bs.modal', function () {
            // Cada vez que se abra el modal, me aseguro de re-ligar el change
            $('#FotoResidente').off('change.preview').on('change.preview', function () {
                const archivo = this.files[0];
                const preview = $('#previewFoto');
                // PARA CARGAR Y MOSTRAR LA IMAGEN ANTES DE GUARDAR EL RESIDENTE
                if (!archivo) {
                    preview.attr('src', '').hide();
                    return;
                }

                const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
                if (!tiposPermitidos.includes(archivo.type)) {
                    mensajesError('#errorCrearResidente', null, "Formato de imagen no válido");
                    preview.hide();
                    return;
                }

                if (archivo.size > 2 * 1024 * 1024) {
                    mensajesError('#errorCrearResidente', null, "La imagen no debe superar los 2MB");
                    preview.hide();
                    return;
                }

                const urlTemporal = URL.createObjectURL(archivo);
                preview.attr('src', urlTemporal).hide().fadeIn(300);
            });
        });
    };
};

async function guardarPersona() {
    const crearPersona = {
        nombreyApellido: document.getElementById("Nombre").value.trim(),
        fechaNacimiento: document.getElementById("Fecha").value,
        sexo: document.getElementById("Sexo").value,
        dni: document.getElementById("DNI").value,
        telefono: document.getElementById("Telefono").value,
    };

    if (!crearPersona.nombreyApellido || !crearPersona.fechaNacimiento || !crearPersona.sexo) {
        mensajesError('#errorCrear', null, "El nombre, la fecha de nacimiento y el sexo son obligatorios");
        return;
    }
    const fechaNacimiento = new Date(crearPersona.fechaNacimiento);
    const fechaLimite = new Date("2010-12-31");

    // Validación: la fecha de nacimiento no puede ser posterior al 31/12/2024
    if (fechaNacimiento > fechaLimite) {
        mensajesError('#errorCrear', null, "La fecha de nacimiento no puede ser posterior al 31/12/2010");
        return;
    }

    if (crearPersona.dni.length <= 6) {
        mensajesError('#errorCrear', null, "El DNI debe tener más de 6 caracteres");
        return;
    }

    try {
        const data = await authFetch("personas", {
            method: "POST",
            body: JSON.stringify(crearPersona)
        });
        const telefono = crearPersona.telefono;
        console.log("telefonoguardado", telefono);

        $("#ModalCrearPersonas").modal("hide");
        // ObtenerPersonas();
        VaciarModal();

        console.log("Persona guardada:", data);
        Swal.fire({
            icon: "success",
            title: "Persona creada correctamente",
            background: '#1295c9',
            color: '#f1f1f1',
            showConfirmButton: false,
            timer: 1500
        });
    } catch (err) {
        console.log("Error al crear la persona:", err);
        // Si el error tiene un objeto 'errors', pásalo a mensajesError
        if (err.errors) {
            mensajesError('#errorCrear', err, null);
        } else {
            mensajesError('#errorCrear', null, `Error al crear: ${err.message}`);
        }
    }
}

function EditarPersona(id) {
    authFetch(`personas/${id}`, { method: 'GET' })
        .then(data => {
            document.getElementById("PersonaIdEditar").value = data.id;
            document.getElementById("RolExistenteEditar").value = data.rol;
            document.getElementById("NombreEditar").value = data.nombreyApellido;
            if (data.fechaNacimiento) {
                const fecha = new Date(data.fechaNacimiento);
                const fechaFormateada = fecha.toISOString().split("T")[0]; // "YYYY-MM-DD"
                document.getElementById("FechaEditar").value = fechaFormateada;
            }
            // document.getElementById("FechaEditar").value = data.fechaNacimiento;
            document.getElementById("SexoEditar").value = data.sexo;
            document.getElementById("DNIEditar").value = data.dni;
            document.getElementById("TelefonoEditar").value = data.telefono;
            $("#ModalEditarPersonas").modal('show');
            console.log("Fecha original:", data.fechaNacimiento);
        }).catch(error => {
            console.error("Error al obtener la persona:", error);
            alert("Error al obtener la persona: " + error.message);
        });
}

async function guardarPersonaEditada() {
    try {
        const id = document.getElementById("PersonaIdEditar").value;
        const personaEditada = {
            id: id,
            nombreyApellido: document.getElementById("NombreEditar").value,
            fechaNacimiento: document.getElementById("FechaEditar").value,
            sexo: document.getElementById("SexoEditar").value,
            dni: document.getElementById("DNIEditar").value,
            telefono: document.getElementById("TelefonoEditar").value,
            rol: document.getElementById("RolExistenteEditar").value,
        };

        await authFetch(`personas/${id}`, {
            method: "PUT",
            body: JSON.stringify(personaEditada)
        });
        ObtenerPersonas();
        $("#ModalEditarPersonas").modal("hide");
        Swal.fire({
            icon: "success",
            title: "Persona editada correctamente",
            background: '#1295c9',
            color: '#f1f1f1',
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.error("Error al editar la persona:", error);
        alert("Error al editar la persona: " + error.message);
    }
}


// async function guardarPersonaEditada(id) {
//     const personaEditadaId = document.getElementById("PersonaIdEditar").value;

//     const editarPersona = {
//         personaId: personaEditadaId,
//         nombreyApellido: document.getElementById("NombreEditar").value,
//         fechaNacimiento: document.getElementById("FechaEditar").value,
//         sexo: document.getElementById("SexoEditar").value,
//         dni: document.getElementById("DNIEditar").value,
//         telefono: document.getElementById("TelefonoEditar").value,
//     };
//     try {
//         await authFetch(`personas/${personaEditadaId}`, {
//             method: 'PUT',
//             body: JSON.stringify(editarPersona)
//         });
//         $("#ModalEditarPersonas").modal('hide');
//         ObtenerPersonas();
//         Swal.fire({
//             icon: "success",
//             title: "Persona editada correctamente",
//             background: '#1295c9',
//             color: '#f1f1f1',
//             showConfirmButton: false,
//             timer: 1500
//         });
//     } catch (error) {
//         console.error("Error al editar la persona:", error);
//         mensajesError('#errorEditarPersona', null, `Error al crear: ${err.message}`);
//     }
// }
function vaciarModalEditar() {
    document.getElementById("PersonaIdEditar").value = "";
    document.getElementById("NombreEditar").value = "";
    document.getElementById("FechaEditar").value = "";
    document.getElementById("SexoEditar").value = "";
    document.getElementById("DNIEditar").value = "";
    document.getElementById("TelefonoEditar").value = "";
    $("#errorEditarPersona").empty();
}


function VaciarModal() {
    document.getElementById("Nombre").value = "";
    document.getElementById("Fecha").value = "";
    document.getElementById("Sexo").value = "";
    document.getElementById("DNI").value = "";
    document.getElementById("Telefono").value = "";
    document.getElementById("EmailProfesional").value = "";
    document.getElementById("EspecialidadId").value = "";
    document.getElementById("FechaIngreso").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("Observaciones").value = "";
    document.getElementById("ObraSocialId").value = "";
    document.getElementById("NroAfiliado").value = "";
    document.getElementById("FotoResidente").value = "";
    document.getElementById("previewFoto").src = "";
    document.getElementById("turno").value = "";
    document.getElementById("EmailEmpleado").value = "";
    document.getElementById("tareasAsignadas").value = "";
    $('#errorCrearEmpleado').empty();
    $('#errorCrearResidente').empty();
    $('#errorCrearProfesional').empty();
    $("#errorCrear").empty();
    ObtenerPersonas();
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
    authFetch(`personas/${id}`, { method: "DELETE", })
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

// function mensajesError(id, data, mensaje) {
//     const contenedor = $(id);
//     contenedor.empty();

//     let listaErrores = "<ul class='sinPunto'>";

//     if (data && data.errors) {
//         $.each(data.errors, function (key, items) {
//             $.each(items, function (_, item) {
//                 listaErrores += `<li>${item}</li>`;
//             });
//         });
//     } else if (mensaje) {
//         listaErrores += `<li>${mensaje}</li>`;
//     }

//     listaErrores += "</ul>";
//     contenedor.append(listaErrores);
//     contenedor.attr("hidden", false);
// }

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

    // 👇 Esto sí muestra correctamente (no deja el atributo hidden)
    contenedor.removeAttr("hidden");
}