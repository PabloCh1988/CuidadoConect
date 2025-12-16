// async function ObtenerResidentesDropdown() {
//   try {
//     const data = await authFetch("residentes"); // endpoint correcto
//     const select = document.getElementById("seleccioneResidente");
//     select.innerHTML =
//       '<option value="" selected disabled>Seleccione un residente</option>';
//     data.forEach((residente) => {
//       select.innerHTML += `<option value="${residente.residenteId}">${residente.nombreResidente}</option>`;
//     });
//   } catch (err) {
//     console.error("Error al cargar residentes:", err);
//   }
// }

// async function CargarProfesional() {
//   try {
//     const data = await authFetch("profesionales"); // endpoint correcto
//     const select = document.getElementById("seleccioneProfesional");
//     select.innerHTML =
//       '<option value="" selected disabled>Seleccione un profesional</option>';
//     data.forEach((prof) => {
//       select.innerHTML += `<option value="${prof.id}">${prof.persona.nombreyApellido}</option>`;
//     });
//   } catch (err) {
//     console.error("Error al cargar residentes:", err);
//   }
// }

// $(document).on("change", "#residenteSelect", function () {
//   const residenteId = this.value;
//   if (residenteId) {
//     obtenerHistoriaClinicaPorResidente(residenteId);
//   } else {
//     $("#historiasClinicas").empty();
//   }
// });
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

    // if (!residente || !profesional) {
    //   mensajesError(
    //     "#errorCrearHistorial", null,
    //     "Por favor, seleccione un residente y un profesional."
    //   );
    //   return;
    // }

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
      background: "#1295c9",
      color: "#f1f1f1",
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

// async function obtenerHistoriaClinicaPorResidente(residenteId) {
//   try {
//     console.log("Llamando API con residenteId:", residenteId);
//     // const data = await authFetch(`historialesmedicos?residenteId=${residenteId}`);
//     const data = await authFetch(`historialesmedicos/por-residente?residenteId=${residenteId}`);
//     console.log("Respuesta API:", data);

//     $("#historiasClinicas").empty();
//     $("#cardsContainerHistorial").empty();

//     if (!data || data.length === 0) {
//       $("#historiasClinicas").append("<tr><td colspan='5'>No hay Historia Clinica Asignada</td></tr>");
//       $("#cardsContainerHistorial").append("<div class='col-12 text-center'><td colspan='5'>No hay Historia Clinica Asignada</td></div>");
//       return;
//     }

//     // Título del residente
//     $.each(data, function (index, historia) {
//       $("#historiasClinicas").append(
//         `<tr id="fila-${historia.id}">
//      <td>${formatearFecha(historia.fechaConsulta)}</td>
//      <td class='font-weight-bold'>${historia.diagnostico}</td>
//      <td>${historia.patologias}</td>
//      <td>${historia.observaciones}</td>
//      <td class='font-weight-bold'>${historia.profesional.persona?.nombreyApellido}</td>
//     </tr>`
//       );

//       $("#cardsContainerHistorial").append(`
//                 <div class="col-12">
//                     <div class="card shadow-sm p-3 mb-2">
//                         <h5 class="card-title mb-1">${historia.diagnostico}</h5>
//                         <p class="mb-1"><strong>Fecha:</strong> ${formatearFecha(historia.fechaConsulta)}</p>
//                         <p class="mb-1"><strong>Patologías:</strong> ${historia.patologias}</p>
//                         <p class="mb-1"><strong>Observaciones:</strong> ${historia.observaciones}</p>
//                         <h6 class="card-title mb-1"><strong>Profesional:</strong> ${historia.profesional.persona?.nombreyApellido}</h6>
//                     </div>
//                 </div>
//         `)
//     });
//   } catch (err) {
//     console.error("Error en ObtenerHistoriaClinicaPorResidente:", err);
//     Swal.fire("Error al obtener la Historia Clínica", err.message, "error");
//   }
// }


async function obtenerHistoriaClinicaPorResidente(residenteId) {
  try {
    console.log("Llamando API con residenteId:", residenteId);

    const data = await authFetch(
      `historialesmedicos/por-residente?residenteId=${residenteId}`
    );

    console.log("Respuesta API:", data);

    const tabla = $("#tablaHistoriaClinica");
    const tbody = $("#historiasClinicas");
    const mensaje = $("#mensajeSinHistoria");

    tbody.empty();
    mensaje.addClass("d-none");

    if (!data || data.length === 0) {
      tabla.addClass("d-none");
      mensaje.removeClass("d-none");
      return;
    }

    tabla.removeClass("d-none");

    $.each(data, function (index, historia) {
      tbody.append(`
    <tr>
      <td>${formatearFecha(historia.fechaConsulta)}</td>
      <td>${historia.diagnostico}</td>
      <td>${historia.patologias}</td>
      <td>${historia.observaciones}</td>
      <td>${historia.profesional?.persona?.nombreyApellido ?? "-"}</td>
    </tr>  `);
    });


  } catch (err) {
    console.error("Error en ObtenerHistoriaClinicaPorResidente:", err);
    Swal.fire("Error", "No se pudo obtener la historia clínica", "error");
  }
}

// document.addEventListener("DOMContentLoaded", () => {
//   ObtenerResidentesDropdown();
//   CargarProfesional();
// });
