API_Empleados = "https://localhost:7233/api/empleados";

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
            "<td>" + empleado.id + "</td>" +
            "<td>" + empleado.persona.nombreyApellido + "</td>" +
            "<td>" + empleado.turno + "</td>" +
            "<td>" + empleado.tareasAsignadas + "</td>" +
            
                     
            "<td><button class='btn btn-outline-danger fa fa-times' onclick='EliminarEmpleado(" + empleado.id + ")'></button></td>" +
            "</tr>"
        );
    });
}
async function cargarPersonasEnSelect() {
    const res = await fetch('https://localhost:7233/api/personas');
    const personas = await res.json();
    const select = document.getElementById('PersonaIdEmpleado');
    select.innerHTML = '<option value="" selected disabled>Seleccione una persona</option>';
    personas.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.nombreyApellido}</option>`;
    });
}

// Llama a esta función cuando abras el modal de empleados
$('#ModalCrearEmpleados').on('show.bs.modal', cargarPersonasEnSelect);

async function CrearEmpleado() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación

    const turno = document.getElementById("turno").value;
    const tareasAsignadas = document.getElementById("tareasAsignadas").value;
    const personaId = document.getElementById("PersonaIdEmpleado").value;

    const empleado = {
        personaId: personaId,
        turno: turno,
        tareasAsignadas: tareasAsignadas        
    };

    const res = await fetch(API_Empleados, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(empleado)
    })
     if (res.ok) {
        const data = await res.json();
        $("#ModalCrearEmpleados").modal("hide"); // Cerrar el modal después de guardar
        ObtenerEmpleados(); // Actualizar la lista de personas
        VaciarModal(); // Llamar a la función para vaciar el modal
      // Aquí puedes manejar la respuesta del servidor
        console.log("Empleado guardado:", data);
        Swal.fire({
            icon: "success",
            title: "Empleado creado correctamente",
            background: '#1295c9',
            color: '#f1f1f1',
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        const errorText = await res.text();
        console.log("Error al crear el empleado:", errorText);
        mensajesError('#errorCrear', null, `Error al crear: ${errorText}`);
    }
} 

ObtenerEmpleados();