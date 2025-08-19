API_Especialidad = "https://localhost:7233/api/especialidades";

function ObtenerEspecialidades() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
    fetch(API_Especialidad, { headers: authHeaders() })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener las especialidades");
            }
            return response.json();
        })
        .then(data => {
            MostrarEspecialidades(data); // Llamar a la función para mostrar las especialidades
        })
        .catch(error => {
            console.error("Error al obtener las especialidades:", error);
            alert("Error al obtener las especialidades: " + error.message);
        });
}

function MostrarEspecialidades(data) {
    $("#todosLasEpecialidades").empty(); // Limpiar la tabla antes de mostrar los datos
    $.each(data, function (index, especialidad) {
        $("#todosLasEpecialidades").append(
            "<tr>" +
            "<td>" + especialidad.nombreEspecialidad + "</td>" +
            "<td><button class='btn btn-outline-success fa fa-pencil' title='Editar' onclick='EditarEspecialidad(" + especialidad.id + ")'></button></td>" +
            "<td><button class='btn btn-outline-danger fa fa-times' title='Eliminar' onclick='EliminarEspecialidad(" + especialidad.id + ")'></button></td>" +
            "</tr>"
        );
    });
}

function GuardarEspecialidad() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
    const nombre = document.getElementById("NombreEspecialidad").value;
    if (!nombre) {
        mensajesError('#errorCrear', null, "El nombre de la especialidad es obligatorio");
        return;
    }
    const especialidad = {
        nombreEspecialidad: nombre
    };
    fetch(API_Especialidad, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(especialidad)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al crear la especialidad");
            }
            return response.json();
        })
        .then(data => {
            $("#ModalCrearEspecialidadess").modal("hide"); // Cerrar el modal
            ObtenerEspecialidades(); // Actualizar la lista de especialidades
        })
        .catch(error => {
            console.error("Error al crear la especialidad:", error);
            alert("Error al crear la especialidad: " + error.message);
        });
}

function EliminarEspecialidad(id) {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
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

    }).then((result) => {
        if (result.isConfirmed) {
            EliminarEspecialidadSi(id);
        }
    });

    function EliminarEspecialidadSi(id) {
        fetch(`${API_Especialidad}/${id}`, {
            method: "DELETE",
            headers: authHeaders()
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al eliminar la especialidad");
                }
                return response.json();
            })
            .then(data => {
                ObtenerEspecialidades(); // Actualizar la lista de especialidades
                Swal.fire({
                    icon: 'success',
                    title: 'Especialidad eliminada correctamente',
                    background: '#1295c9',
                    color: '#f1f1f1',
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => {
                console.error("Error al eliminar la especialidad:", error);
                alert("Error al eliminar la especialidad: " + error.message);
            });
    }
}

function EditarEspecialidad(id) {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
    fetch(`${API_Especialidad}/${id}`, { headers: authHeaders(), method: "GET", })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener la especialidad");
            }
            return response.json();
        })
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

function ActualizarEspecialidad() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
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
    console.log("Datos a actualizar:", especialidad);
    fetch(`${API_Especialidad}/${especialidadId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(especialidad)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al actualizar la especialidad");
            }
            return response.json();
        })
        .then(data => {
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
        })
        .catch(error => {
            console.error("Error al actualizar la especialidad:", error);
            alert("Error al actualizar la especialidad: " + error.message);
        });
    $('#formEditarEspecialidad').removeData('EspecialidadId'); // Limpiar el ID del formulario
}