$(document).on("change", "#residenteSelect", function () {
  const residenteId = this.value;

  if (residenteId) {
    obtenerHistoriaClinicaPorResidente(residenteId);
  } else {
    $("#historiasClinicas").empty();
    $("#cardsContainerHistorial").empty();
    $("#tablaHistoriaClinica").addClass("d-none");
    $("#mensajeSinHistoria").addClass("d-none");
  }
});


async function guardarHistorial() {
  try {
    const residente = document.getElementById("residenteSelect2").value;
    const profesional = document.getElementById("profesionalSelect").value;

    const historial = {
      diagnostico: document.getElementById("Diagnostico").value,
      patologias: document.getElementById("Patologias").value,
      observaciones: document.getElementById("Observaciones").value.trim(),
      fechaConsulta: document.getElementById("FechaConsulta").value,
      residenteId: residente,
      profesionalId: profesional,
    };

    if (!residente || !profesional || !historial.diagnostico || !historial.patologias || !historial.observaciones || !historial.fechaConsulta) {
      mensajesError(
        "#errorCrearHistorial", null,
        "Por favor, complete todos los campos."
      );
      return;
    }

    const data = await authFetch("historialesmedicos", {
      method: "POST",
      body: JSON.stringify(historial),
    });

    Swal.fire({
      icon: "success",
      title: "Historial creado correctamente",
      showConfirmButton: false,
      timer: 1500,
    });
    document.getElementById("Diagnostico").value = "";
    document.getElementById("Patologias").value = "";
    document.getElementById("Observaciones").value = "";
    document.getElementById("FechaConsulta").value = "";
    document.getElementById("residenteSelect2").value = "";
    document.getElementById("profesionalSelect").value = "";
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
function VaciarFormularioHistorial() {
  document.getElementById("Diagnostico").value = "";
  document.getElementById("Patologias").value = "";
  document.getElementById("Observaciones").value = "";
  document.getElementById("FechaConsulta").value = "";
  document.getElementById("residenteSelect2").value = "";
  document.getElementById("profesionalSelect").value = "";
  $("#errorCrearHistorial").empty();
}


async function obtenerHistoriaClinicaPorResidente(residenteId) {
  try {
    const data = await authFetch(
      `historialesmedicos/por-residente?residenteId=${residenteId}`
    );

    const tabla = $("#tablaHistoriaClinica");
    const tbody = $("#historiasClinicas");
    const contenedorCards = $("#historiasClinicasCards"); // div para cards
    const mensaje = $("#mensajeSinHistoria");

    tbody.empty();
    contenedorCards.empty();
    mensaje.addClass("d-none");

    if (!data || data.length === 0) {
      tabla.addClass("d-none");
      contenedorCards.addClass("d-none");
      mensaje.removeClass("d-none");
      return;
    }

    tabla.removeClass("d-none");
    contenedorCards.removeClass("d-none");

    data.forEach(historia => {
      // Tabla
      tbody.append(`
        <tr>
          <td>${formatearFecha(historia.fechaConsulta)}</td>
          <td>${historia.diagnostico}</td>
          <td>${historia.patologias}</td>
          <td>${historia.observaciones}</td>
          <td>${historia.profesional?.persona?.nombreyApellido ?? "-"}</td>
        </tr>
      `);

      // Cards (para celular)
      contenedorCards.append(`
        <div class="card mb-2 d-block d-md-none">
          <div class="card-body">
            <p><strong>Fecha:</strong> ${formatearFecha(historia.fechaConsulta)}</p>
            <p><strong>Diagnóstico:</strong> ${historia.diagnostico}</p>
            <p><strong>Patologías:</strong> ${historia.patologias}</p>
            <p><strong>Observaciones:</strong> ${historia.observaciones}</p>
            <p><strong>Profesional:</strong> ${historia.profesional?.persona?.nombreyApellido ?? "-"}</p>
          </div>
        </div>
      `);
    });

  } catch (err) {
    console.error("Error en ObtenerHistoriaClinicaPorResidente:", err);
    Swal.fire("Error", "No se pudo obtener la historia clínica", "error");
  }
}


