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

function LimpiarModalCita() {
  document.getElementById("residenteSelect").value = "";
  document.getElementById("profesionalSelect").value = "";
  document.getElementById("FechaCita").value = "";
  document.getElementById("HoraCita").value = "";
  document.getElementById("Observaciones").value = "";
  $('#errorAgendarCitaMedica').empty();
}

function getBadgeClass(estado) {
  switch (estado) {
    case "Pendiente":
      return "<button type='button' class='btn btn-outline-warning btn-sm' disabled>Pendiente</button>";
    case "Confirmada":
      return "<button type='button' class='btn btn-outline-success btn-sm' disabled>Confirmada</button>";
    case "Cancelada":
      return "<button type='button' class='btn btn-outline-danger btn-sm' disabled>Cancelada</button>";
    case "Completada":
      return "<button type='button' class='btn btn-outline-secondary btn-sm' disabled>Completada</button>";
    default:
      return "<button type='button' class='btn btn-outline-light text-dark btn-sm' disabled>Desconocido</button>";
  }
}

// function getBadgeClass(estado) {
//   switch (estado) {
//     case "Pendiente": return "<span class='btn btn-outline-warning'>Pendiente</span>";
//     case "Confirmada": return "bg-success text-white";
//     case "Cancelada": return "bg-danger text-white";
//     case "Completada": return "bg-secondary text-white";
//     default: return "bg-light text-dark";
//   }
// }
// "bg-warning text-dark";

async function obtenerCitasPorResidente(residenteId) {
  try {
    console.log("Llamando API con residenteId:", residenteId);
    const data = await authFetch(`citasmedicas/por-residente?residenteId=${residenteId}`);

    console.log("Respuesta API:", data);

    $("#citasPorResidente").empty();
    $("#cardsContainerCitasMedicas").empty();

    if (!data || data.length === 0) {
      $("#citasPorResidente").append("<tr><td colspan='5' class='text-center'>No hay Citas Médicas Solicitadas</td></tr>");
      $("#cardsContainerCitasMedicas").append("<div class='col-12 text-center'>No hay Citas Médicas Solicitadas</div>");
      return;
    }

    // Generar contenido dinámico
    data.forEach((citas) => {
      const badgeClass = getBadgeClass(citas.estado); // ← Aquí aplicamos tu función

      // Tabla
      $("#citasPorResidente").append(`
        <tr id="fila-${citas.id}">
          <td>${citas.observaciones}</td>
          <td>${formatearFecha(citas.fecha)}</td>
          <td>${citas.hora}</td>
          <td>${citas.profesional.persona?.nombreyApellido || "Sin profesional"}</td>
          <td><span class="badge2 ${badgeClass}">${citas.estado}</span></td>
        </tr>
      `);

      // Card
      $("#cardsContainerCitasMedicas").append(`
        <div class="col-12">
          <div class="card shadow-sm p-3 mb-2">
            <h5 class="card-title mb-1">${citas.observaciones}</h5>
            <p class="mb-1"><strong>Fecha:</strong> ${formatearFecha(citas.fecha)}</p>
            <p class="mb-1"><strong>Hora:</strong> ${citas.hora}</p>
            <p class="mb-1">
              <strong>Estado:</strong> 
              <span class="badge2 ${badgeClass}">${citas.estado}</span>
            </p>
            <h6 class="card-title mb-1"><strong>Profesional:</strong> ${citas.profesional.persona?.nombreyApellido || "Sin profesional"}</h6>
          </div>
        </div>
      `);
    });

  } catch (err) {
    console.error("Error en ObtenerCitasPorResidente:", err);
    Swal.fire("Error al obtener las citas", err.message, "error");
  }
}


// async function obtenerCitasPorResidente(residenteId) {
//   try {
//     console.log("Llamando API con residenteId:", residenteId);
//     // const data = await authFetch(`citasmedicas?residenteId=${residenteId}`);
//     const data = await authFetch(`citasmedicas/por-residente?residenteId=${residenteId}`);

//     console.log("Respuesta API:", data);

//     $("#citasPorResidente").empty();
//     $("#cardsContainerCitasMedicas").empty();

//     if (!data || data.length === 0) {
//       $("#citasPorResidente").append("<tr><td colspan='4'>No hay Citas Médicas Solicitadas</td></tr>");
//       $("#cardsContainerCitasMedicas").append("<div class='col-12 text-center'><td colspan='4'>No hay Citas Médicas Solicitadas</td></div>");
//       return;
//     }

//     // Título del residente
//     $.each(data, function (index, citas) {
//       $("#citasPorResidente").append(
//         `<tr id="fila-${citas.id}">
//      <td>${citas.observaciones}</td>
//      <td>${formatearFecha(citas.fecha)}</td>
//      <td>${citas.hora}</td>
//      <td>${citas.profesional.persona?.nombreyApellido}</td>
//      <td>${citas.estado}</td>
//     </tr>`
//       );

//       $("#cardsContainerCitasMedicas").append(`
//                 <div class="col-12">
//                     <div class="card shadow-sm p-3 mb-2">
//                         <h5 class="card-title mb-1">${citas.observaciones}</h5>
//                         <p class="mb-1"><strong>Fecha:</strong> ${formatearFecha(citas.fecha)}</p>
//                         <p class="mb-1"><strong>Hora:</strong> ${citas.hora}</p>
//                         <p class="mb-1"><strong>Estado:</strong> ${citas.estado}</p>
//                         <h6 class="card-title mb-1"><strong>Profesional:</strong> ${citas.profesional.persona?.nombreyApellido}</h6>
//                     </div>
//                 </div>
//         `)
//     });
//   } catch (err) {
//     console.error("Error en ObtenerCitasPorResidente:", err);
//     Swal.fire("Error al obtener las citas", err.message, "error");
//   }
// }