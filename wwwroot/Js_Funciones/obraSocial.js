// API_ObraSocial = "https://localhost:7233/api/obrasociales";

async function ObtenerObrasSociales() {
    try {
        const data = await authFetch("obrasociales");
        $("#todosLasObras").empty(); // Limpiar la tabla antes de mostrar los datos
        $.each(data, function (index, obraSocial) {
            $("#todosLasObras").append(
                "<tr>" +
                "<td>" + obraSocial.nombre + "</td>" +
                "<td>" + obraSocial.plan + "</td>" +
                "<td><button class='btn btn-outline-danger fa fa-times' title='Eliminar' onclick='EliminarObraSocial(" + obraSocial.id + ")'></button></td>" +
                "</tr>"
            );
        });
    } catch (err) {
        console.error("Error en ObtenerObrasSociales:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error al obtener obras sociales',
            text: err.message,
            background: '#1295c9',
            color: '#f1f1f1'
        });
    }
}

async function CrearObraSocial() {
    const nombre = document.getElementById("NombreObraSocial").value;
    const plan = document.getElementById("PlanObraSocial").value;
    if (!nombre || !plan) {
        mensajesError('#errorObraSocial', null, "Todos los campos son obligatorios");
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
            background: '#1295c9',
            color: '#f1f1f1',
            showConfirmButton: false,
            timer: 1500
        });
    } catch (err) {
        console.error("Error al crear la Obra Social:", err);
        mensajesError('#errorObraSocial', null, `Error al crear: ${err.message}`);
    }
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
        background: '#1295c9',
        color: '#f1f1f1',
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
                background: '#1295c9',
                color: '#f1f1f1',
                showConfirmButton: false,
                timer: 1500
            });
            ObtenerObrasSociales();
        })
        .catch(async (error) =>
            console.error("Error al eliminar la Obra Social:", error));
}