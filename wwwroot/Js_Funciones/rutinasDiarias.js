async function ObtenerRutinas(){
    try {
        const data = await authFetch("rutinasdiarias");
        $("#todasLasRutinas").empty();
        $.each(data, function (index, rutina) {
            $("#todasLasRutinas").append(
                "<tr>" +
                "<td>" + rutina.descripcion + "</td>" +
                "<td>" + rutina.estado + "</td>" +
                "<td>" + formatearFecha(rutina.fechaCreacion) + "</td>" +
                "<td><button class='btn btn-outline-success fa fa-pencil' title='Editar' onclick='EditarRutina(" + rutina.id + ")'></button></td>" +
                "<td><button class='btn btn-outline-danger fa fa-times' onclick='EliminarRutina(" + rutina.id + ")'></button></td>" +
                "</tr>"
            );
    });
} catch (err) {
        console.error("Error en ObtenerRutinas:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error al obtener rutinas',
            text: err.message,
            background: '#1295c9',
            color: '#f1f1f1'
        });
    }
}

async function guardarRutina() {
    const descripcion = document.getElementById("Descripcion").value;
    const estado = document.getElementById("Estado").value;

    const rutina = {
        descripcion: descripcion,
        estado: estado
    };

    try {
        const data = await authFetch("rutinasdiarias", {
            method: "POST",
            body: JSON.stringify(rutina)
        });

        $("#modalRutina").modal("hide");
        ObtenerRutinas();
        document.getElementById("Descripcion").value = '';

        console.log("Rutina guardada:", data);
    } catch (err) {
        console.error("Error en CrearRutina:", err);
        mensajesError('#errorCrear', null, "Error al crear rutina: " + err.message);
    }
}