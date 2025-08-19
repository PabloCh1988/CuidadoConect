API_Profesional = "https://localhost:7233/api/profesionales";

function ObtenerProfesionales() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
    fetch(API_Profesional, { headers: authHeaders() })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los profesionales");
            }
            return response.json();
        })
        .then(data => {
            MostrarProfesionales(data); // Llamar a la función para mostrar los profesionales
        })
        .catch(error => {
            console.error("Error al obtener los profesionales:", error);
            alert("Error al obtener los profesionales: " + error.message);
        });
}

function MostrarProfesionales(data) {
    $("#todosLosProfesionales").empty(); // Limpiar la tabla antes de mostrar los datos
    $.each(data, function (index, profesional) {
        $("#todosLosProfesionales").append(
            "<tr>" +
            "<td>" + profesional.persona.nombreyApellido + "</td>" +
            "<td>" + profesional.especialidad.nombreEspecialidad + "</td>" +
            "<td><button class='btn btn-outline-danger fa fa-times' title='Eliminar' onclick='EliminarProfesional(" + profesional.id + ")'></button></td>" +
            "</tr>"
        );
    });
}

function CrearProfesional() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación
    const personaId = $('#formProfesional').data('PersonaId');
    const especialidadId = parseInt(document.getElementById("EspecialidadId").value);
    if (isNaN(personaId)) {
        mensajesError('#errorCrear', null, "Debes seleccionar una persona válida");
        return;
    }
    if (isNaN(especialidadId)) {
        mensajesError('#errorCrear', null, "Debes seleccionar una especialidad válida");
        return;
    }
    const profesional = {
        personaId: personaId,
        especialidadId: especialidadId
    };
    fetch(API_Profesional, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(profesional)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al crear el profesional");
            }
            return response.json();
        })
        .then(data => {
            $('#modalProfesional').modal('hide');
            ObtenerPersonas(); // Actualizar la lista de personas

            Swal.fire({
            icon: "success",
            title: "Profesional creado correctamente",
            background: '#1295c9',
            color: '#f1f1f1',
            showConfirmButton: false,
            timer: 1500
        });
        })
        .catch(error => {
            console.error("Error al crear el profesional:", error);
            alert("Error al crear el profesional: " + error.message);
        });
}