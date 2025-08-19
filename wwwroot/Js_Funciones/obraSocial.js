API_ObraSocial = "https://localhost:7233/api/obrasociales";

function GetObrasSociales() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
    fetch(API_ObraSocial, { headers: authHeaders() })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener las obras sociales");
            }
            return response.json();
        })
        .then(data => {
            MostrarObrasSociales(data); // Llamar a la función para mostrar las obras sociales
        })
        .catch(error => {
            console.error("Error al obtener las obras sociales:", error);
            alert("Error al obtener las obras sociales: " + error.message);
        });
}

function MostrarObrasSociales(data) {
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
}

function CrearObraSocial() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
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
    fetch(API_ObraSocial, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(obraSocial)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al crear la obra social");
            }
            return response.json();
        })
        .then(data => {
            console.log("Obra social creada:", data);
            document.getElementById("NombreObraSocial").value = ""; // Limpiar el campo de nombre
            document.getElementById("PlanObraSocial").value = ""; // Limpiar el campo de plan
            $("#modalAgregarObraSocial").modal('hide'); // Cerrar el modal
            $("#errorObraSocial").empty(); // Limpiar mensajes de error
            GetObrasSociales(); // Actualizar la lista de obras sociales
        })
        .catch(error => {
            console.error("Error al crear la obra social:", error);
            alert("Error al crear la obra social: " + error.message);
        });
}

function EliminarObraSocial(id) {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    });

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
    }).then((result) => {
        if (result.isConfirmed) {
            EliminarObraSi(id);
        }
    });

    function EliminarObraSi(id) {
        fetch(`${API_ObraSocial}/${id}`, {
            method: "DELETE",
            headers: authHeaders()
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al eliminar la Obra Social");
                }
                // ✅ Manejar si no hay contenido
                if (response.status === 204) {
                    return null;
                }
                return response.json().catch(() => null);
            })
            .then(data => {
                GetObrasSociales(); // Refrescar lista
                Swal.fire({
                    icon: 'success',
                    title: 'Obra Social eliminada correctamente',
                    background: '#1295c9',
                    color: '#f1f1f1',
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => {
                console.error("Error al eliminar la Obra Social:", error);
                alert("Error al eliminar la Obra Social: " + error.message);
            });
    }
}

