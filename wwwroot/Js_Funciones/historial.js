async function ObtenerResidentesDropdown() {
  try {
    const data = await authFetch("residentes"); // endpoint correcto
    const select = document.getElementById("seleccioneResidente");
    select.innerHTML =
      '<option value="" selected disabled>Seleccione un residente</option>';
    data.forEach((residente) => {
      select.innerHTML += `<option value="${residente.residenteId}">${residente.nombreResidente}</option>`;
    });
  } catch (err) {
    console.error("Error al cargar residentes:", err);
  }
}

async function CargarProfesional() {
  try {
    const data = await authFetch("profesionales"); // endpoint correcto
    const select = document.getElementById("seleccioneProfesional");
    select.innerHTML =
      '<option value="" selected disabled>Seleccione un profesional</option>';
    data.forEach((prof) => {
      select.innerHTML += `<option value="${prof.id}">${prof.persona.nombreyApellido}</option>`;
    });
  } catch (err) {
    console.error("Error al cargar residentes:", err);
  }
}

$(document).on("change", "#residenteSelect", function () {
  const residenteId = this.value;
  if (residenteId) {
    obtenerHistoriaClinicaPorResidente(residenteId);
  } else {
    $("#historiasClinicas").empty();
  }
});

async function guardarHistorial() {
  try {
    const residente = document.getElementById("seleccioneResidente").value;
    const profesional = document.getElementById("seleccioneProfesional").value;

    const historial = {
      diagnostico: document.getElementById("Diagnostico").value,
      patologias: document.getElementById("Patologias").value,
      observaciones: document.getElementById("Observaciones").value,
      fechaConsulta: document.getElementById("FechaConsulta").value,
      residenteId: residente,
      profesionalId: profesional,
    };

    const data = await authFetch("historialesmedicos", {
      method: "POST",
      body: JSON.stringify(historial),
    });

    Swal.fire({
      icon: "success",
      title: "Historial creado correctamente",
      background: "#1295c9",
      color: "#f1f1f1",
      showConfirmButton: false,
      timer: 1500,
    });
    document.getElementById("Diagnostico").value = "";
    document.getElementById("Patologias").value = "";
    document.getElementById("Observaciones").value = "";
    document.getElementById("FechaConsulta").value = "";
    document.getElementById("seleccioneResidente").value = "";
    document.getElementById("seleccioneProfesional").value = "";
    console.log("Historial guardado", data);
  } catch (err) {
    console.log("Error al crear el Historial:", err);
    mensajesError(
      "#errorCrearHistorial",
      null,
      `Error al crear: ${err.message}`
    );
  }
}

ObtenerResidentesDropdown();
CargarProfesional();


async function obtenerHistoriaClinicaPorResidente(residenteId) {
  try {
    console.log("Llamando API con residenteId:", residenteId);
    // const data = await authFetch(`historialesmedicos?residenteId=${residenteId}`);
    const data = await authFetch(`historialesmedicos/por-residente?residenteId=${residenteId}`);
    console.log("Respuesta API:", data);

    $("#historiasClinicas").empty();

    if (!data || data.length === 0) {
      $("#historiasClinicas").append("<tr><td colspan='4'>No hay Historia Clinica Asignada</td></tr>");
      return;
    }

    // Título del residente
    $.each(data, function (index, historia) {
      $("#historiasClinicas").append(
        `<tr id="fila-${historia.id}">
     <td>${formatearFecha(historia.fechaConsulta)}</td>
     <td>${historia.diagnostico}</td>
     <td class='d-none d-sm-table-cell'>${historia.patologias}</td>
     <td class='d-none d-sm-table-cell'>${historia.observaciones}</td>
     <td>${historia.profesional.persona?.nombreyApellido}</td>
    </tr>`
      );
    });
  } catch (err) {
    console.error("Error en ObtenerHistoriaClinicaPorResidente:", err);
    Swal.fire("Error al obtener la Historia Clínica", err.message, "error");
  }
}