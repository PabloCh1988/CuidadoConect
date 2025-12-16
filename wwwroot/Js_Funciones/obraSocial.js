async function mostrarTotalObrasSociales() {
  try {
    const obrasS = await authFetch(`obrasociales`);

    const total = obrasS.length;
    document.getElementById('total-obras').textContent = total;
  } catch (error) {
    console.error('Error al obtener obras sociales:', error);
    document.getElementById('total-obras').textContent = 'Error';
  }
}

// async function ObtenerObrasSociales() {
//     try {
//         const data = await authFetch("obrasociales");
//         $("#todosLasObras").empty(); // Limpiar la tabla antes de mostrar los datos
//         $.each(data, function (index, obraSocial) {
//             $("#todosLasObras").append(
//                 "<tr>" +
//                 "<td>" + obraSocial.nombre + "</td>" +
//                 "<td>" + obraSocial.plan + "</td>" +
//                 "<td><button class='btn btn-outline-danger fa fa-times' title='Editar' onclick='EditarObraSocial(" + obraSocial.id + ")'></button></td>" +
//                 "<td><button class='btn btn-outline-danger fa fa-times' title='Eliminar' onclick='EliminarObraSocial(" + obraSocial.id + ")'></button></td>" +
//                 "</tr>"
//             );
//         });
//     } catch (err) {
//         console.error("Error en ObtenerObrasSociales:", err);
//         Swal.fire({
//             icon: 'error',
//             title: 'Error al obtener obras sociales',
//             text: err.message,
//         });
//     }
// }
async function ObtenerObrasSociales() {
    try {
        const data = await authFetch("obrasociales");
        $("#todosLasObras").empty();

        $.each(data, function (index, obra) {
            $("#todosLasObras").append(`
                <tr>
                    <td id="nombre-${obra.id}">${obra.nombre}</td>
                    <td id="plan-${obra.id}">${obra.plan}</td>
                    <td class='text-center'>
                        <button class="btn btn-outline-primary fa fa-pencil"
                            title="Editar"
                            onclick="activarEdicionObraSocial(${obra.id}, '${obra.nombre}', '${obra.plan}')">
                        </button>
                        <button class="btn btn-outline-danger fa fa-times"
                            title="Eliminar"
                            onclick="EliminarObraSocial(${obra.id})">
                        </button>
                    </td>
                </tr>
            `);
        });
    } catch (err) {
        console.error("Error en ObtenerObrasSociales:", err);
        Swal.fire("Error", "No se pudieron obtener las obras sociales", "error");
    }
}
function activarEdicionObraSocial(id, nombreActual, planActual) {
    const celdaNombre = document.getElementById(`nombre-${id}`);
    const celdaPlan = document.getElementById(`plan-${id}`);

    // evita doble edición
    if (celdaNombre.querySelector("input")) return;

    const inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.value = nombreActual;
    inputNombre.className = "form-control mb-1";
    inputNombre.id = `input-nombre-${id}`;

    const inputPlan = document.createElement("input");
    inputPlan.type = "text";
    inputPlan.value = planActual;
    inputPlan.className = "form-control mb-1";
    inputPlan.id = `input-plan-${id}`;

    const btnGuardar = document.createElement("button");
    btnGuardar.className = "btn btn-primary btn-sm me-1";
    btnGuardar.innerHTML = '<i class="fa fa-check"></i>';
    btnGuardar.onclick = () => guardarEdicionObraSocial(id);

    const btnCancelar = document.createElement("button");
    btnCancelar.className = "btn btn-danger btn-sm";
    btnCancelar.innerHTML = '<i class="fa fa-times"></i>';
    btnCancelar.onclick = () =>
        cancelarEdicionObraSocial(id, nombreActual, planActual);

    celdaNombre.innerHTML = "";
    celdaPlan.innerHTML = "";

    celdaNombre.appendChild(inputNombre);
    celdaPlan.appendChild(inputPlan);

    celdaPlan.appendChild(btnGuardar);
    celdaPlan.appendChild(btnCancelar);

    inputNombre.focus();
}

// BOTON GUARDAR EDICION
async function guardarEdicionObraSocial(id) {
    const nombre = document.getElementById(`input-nombre-${id}`).value.trim();
    const plan = document.getElementById(`input-plan-${id}`).value.trim();

    if (!nombre || !plan) {
        Swal.fire({
            icon: "warning",
            title: "Campos obligatorios",
            text: "El nombre y el plan no pueden estar vacíos",
        });
        return;
    }

    try {
        await authFetch(`obrasociales/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                id: id,
                nombre: nombre,
                plan: plan
            }),
        });

        Swal.fire({
            icon: "success",
            title: "Obra social actualizada",
            showConfirmButton: false,
            timer: 1200,
        });

        document.getElementById(`nombre-${id}`).innerText = nombre;
        document.getElementById(`plan-${id}`).innerText = plan;

    } catch (err) {
        Swal.fire("Error", "No se pudo editar la obra social", "error");
    }
}
// BOTON CANCELAR EDICION
function cancelarEdicionObraSocial(id, nombreOriginal, planOriginal) {
    document.getElementById(`nombre-${id}`).innerText = nombreOriginal;
    document.getElementById(`plan-${id}`).innerText = planOriginal;
}


async function CrearObraSocial() {
    const nombre = document.getElementById("NombreObraSocial").value.trim();
    const plan = document.getElementById("PlanObraSocial").value.trim();

    if (!nombre || !plan) {
        Swal.fire({
            icon: 'warning',
            title: 'Todos los campos son obligatorios',
            showConfirmButton: true,
        });
        return;
    }
    const obraSocial = {
        nombre: nombre,
        plan: plan
    };
    try {
        const data = await authFetch("obrasociales", {
            method: "POST",
            body: JSON.stringify(obraSocial)
        });

        $("#modalAgregarObraSocial").modal("hide");
        ObtenerObrasSociales();
        document.getElementById("NombreObraSocial").value = "";
        document.getElementById("PlanObraSocial").value = "";
        $("#errorObraSocial").empty();
        Swal.fire({
            icon: 'success',
            title: 'Obra Social creada correctamente',
            showConfirmButton: false,
            timer: 1500
        });
    } catch (err) {
        console.error("Error al crear la Obra Social:", err);
        mensajesError('#errorObraSocial', null, `Error al crear: ${err.message}`);
    }
}

function EditarObraSocial(){

}

function VaciarFormularioObraSocial() {
    document.getElementById("NombreObraSocial").value = "";
    document.getElementById("PlanObraSocial").value = "";
    $("#errorObraSocial").empty();
}


function EliminarObraSocial(id) {
    Swal.fire({
        title: "¿Estás seguro de eliminar esta Obra Social?",
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0005d1',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarla'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await EliminarObraSi(id);
        }
    });
}

async function EliminarObraSi(id) {
    authFetch(`obrasociales/${id}`, { method: "DELETE" })
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Obra Social eliminada correctamente',
                showConfirmButton: false,
                timer: 1500
            });
            ObtenerObrasSociales();
        })
        .catch(async (error) =>
            console.error("Error al eliminar la Obra Social:", error));
}