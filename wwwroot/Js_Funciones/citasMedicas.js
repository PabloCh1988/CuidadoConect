$(document).on("change", "#residenteSelect2", function () {
  const residenteId = this.value;
  if (residenteId) {
    obtenerCitasPorResidente(residenteId);
  } else {
    $("#citasPorResidente").empty();
  }
});

async function AgendarCitaMedica() {
    try {
        const residente = document.getElementById("residenteSelect").value;
        const profesional = document.getElementById("profesionalSelect").value;
        const fechaCita = document.getElementById("FechaCita").value;
        const horaCita = document.getElementById("HoraCita").value;
        const observaciones = document.getElementById("Observaciones").value;

        if (!residente || !profesional || !fechaCita || !horaCita) {
            mensajesError('#errorAgendarCitaMedica', null, "Por favor, complete todos los campos obligatorios.");
            return;
        }

        const cita = {
            fecha: fechaCita,
            hora: horaCita,
            observaciones: observaciones,
            residenteId: residente,
            profesionalId: profesional
        }

        await authFetch("citasmedicas/agendar", {
            method: "POST",
            body: JSON.stringify(cita)
        });
        Swal.fire({
            icon: "success",
            title: "Cita médica agendada correctamente",
            background: '#1295c9',
            color: '#f1f1f1',
            showConfirmButton: false,
            timer: 1500
        });
        document.getElementById("residenteSelect").value = "";
        document.getElementById("profesionalSelect").value = "";
        document.getElementById("FechaCita").value = "";
        document.getElementById("HoraCita").value = "";
        document.getElementById("Observaciones").value = "";
        $('#errorAgendarCitaMedica').empty();
    } catch (err) {
        console.log("Error al agendar la cita médica:", err);
        mensajesError('#errorAgendarCitaMedica', null, `Error al agendar: ${err.message}`);
    }
}


async function obtenerCitasPorResidente(residenteId) {
  try {
    console.log("Llamando API con residenteId:", residenteId);
    // const data = await authFetch(`citasmedicas?residenteId=${residenteId}`);
    const data = await authFetch(`citasmedicas/por-residente?residenteId=${residenteId}`);

    console.log("Respuesta API:", data);

    $("#citasPorResidente").empty();

    if (!data || data.length === 0) {
      $("#citasPorResidente").append("<tr><td colspan='4'>No hay Citas Médicas Solicitadas</td></tr>");
      return;
    }

    // Título del residente
    $.each(data, function (index, citas) {
      $("#citasPorResidente").append(
        `<tr id="fila-${citas.id}">
     <td>${citas.observaciones}</td>
     <td>${formatearFecha(citas.fecha)}</td>
     <td>${citas.hora}</td>
     <td>${citas.profesional.persona?.nombreyApellido}</td>
     <td>${citas.estado}</td>
    </tr>`
      );
    });
  } catch (err) {
    console.error("Error en ObtenerCitasPorResidente:", err);
    Swal.fire("Error al obtener las citas", err.message, "error");
  }
}