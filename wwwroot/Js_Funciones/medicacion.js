// async function guardarMedicamento() {
//   try {
//     const residente = document.getElementById("residenteSelect").value;
//     const nombreMedicina = document.getElementById("NombreMedicamento").value;
//     const dosisMedic = document.getElementById("Dosis").value;
//     const frecuenciaMedic = document.getElementById("Frecuencia").value;
//     const via = document.getElementById("ViaAdministracion").value;
//     const fechaIn = document.getElementById("FechaInicio").value;
//     const fechaOut = document.getElementById("FechaFin").value;

//     if (!residente || !nombreMedicina || !dosisMedic || !frecuenciaMedic || !via || !fechaIn || !fechaOut) {
//       mensajesError(
//         "#errorCrearMedicamento", null, "Por favor, complete todos los campos.");
//       return;
//     }
//     if (fechaOut < fechaIn) {
//       mensajesError(
//         "#errorCrearMedicamento", null, "La fecha de fin no puede ser anterior a la fecha de inicio.");
//       return;
//     }

//     const medicamento = {
//       nombreMedicamento: nombreMedicina,
//       dosis: dosisMedic,
//       frecuencia: frecuenciaMedic,
//       viaAdministracion: via,
//       fechaInicio: fechaIn,
//       fechaFin: fechaOut,
//       residenteId: residente
//     }

//     const data = await authFetch("medicaciones", {
//       method: 'POST',
//       body: JSON.stringify(medicamento)
//     });
//     $("#errorCrearMedicamento").empty();
//     document.getElementById("residenteSelect").value = "";
//     document.getElementById("NombreMedicamento").value = "";
//     document.getElementById("Dosis").value = "";
//     document.getElementById("Frecuencia").value = "";
//     document.getElementById("ViaAdministracion").value = "";
//     document.getElementById("FechaInicio").value = "";
//     document.getElementById("FechaFin").value = "";
//     console.log("Medicamento guardado", data);

//     Swal.fire({
//       icon: "success",
//       title: "Medicamento creado correctamente",
//       background: '#1295c9',
//       color: '#f1f1f1',
//       showConfirmButton: false,
//       timer: 1500
//     });
//   } catch (err) {
//     console.log("Error al crear el medicamento:", err);
//     mensajesError('#errorCrearMedicamento', null, `Error al crear: ${err.message}`);
//   }
// }

// async function VaciarFormularioMedicacion() {
//   document.getElementById("NombreMedicamento").value = "";
//   document.getElementById("Dosis").value = "";
//   document.getElementById("Frecuencia").value = "";
//   document.getElementById("ViaAdministracion").value = "";
//   document.getElementById("FechaInicio").value = "";
//   document.getElementById("FechaFin").value = "";
//   $('#errorCrearMedicamento').empty();
// }

// $(document).on("change", "#residenteSelect", function () {
//   const residenteId = this.value;
//   if (residenteId) {
//     obtenerMedicamentosPorResidente(residenteId);
//   } else {
//     $("#medicacionPorResidente").empty();
//   }
// });

// async function obtenerMedicamentosPorResidente(residenteId) {
//   try {
//     console.log("Llamando API con residenteId:", residenteId);
//     const data = await authFetch(`medicaciones?residenteId=${residenteId}`);
//     console.log("Respuesta API:", data);

//     $("#medicacionPorResidente").empty();
//     $("#cardsContainerMedicacion").empty();
//     // Calcular la fecha de hace un mes
//     const hoy = new Date();
//     const unMesAtras = new Date();
//     unMesAtras.setMonth(hoy.getMonth() - 1);

//     // Filtrar medicamentos cuya fechaFin sea menor o igual a hace un mes
//     const medicamentosFiltrados = data.filter(m => {
//       const fechaFin = new Date(m.fechaFin);
//       return fechaFin >= unMesAtras;
//     });

//     if (!medicamentosFiltrados || medicamentosFiltrados.length === 0) {

//       $("#medicacionPorResidente").append("<tr><td colspan='5'>No hay Medicamentos Asignados</td></tr>");
//       $("#cardsContainerMedicacion").append("<div class='col-12 text-center'><td colspan='5'>No hay Medicamentos Asignados</td></div>");
//       return;
//     }

//     // Título del residente
//     $.each(medicamentosFiltrados, function (index, medicamento) {
//       $("#medicacionPorResidente").append(
//         `<tr id="fila-${medicamento.id}">
//           <td class='font-weight-bold'>${medicamento.nombreMedicamento}</td>
//           <td>${medicamento.dosis}</td>
//           <td class="d-none d-sm-table-cell">${medicamento.frecuencia}</td>
//           <td>${medicamento.viaAdministracion}</td>
//           <td>${formatearFecha(medicamento.fechaInicio)}</td>
//           <td>${formatearFecha(medicamento.fechaFin)}</td>
//         </tr>`
//       );

//       $("#cardsContainerMedicacion").append(`
//          <div class="col-12">
//             <div class="card shadow-sm p-3 mb-2">
//               <h5 class="card-title mb-1">${medicamento.nombreMedicamento}</h5>
//               <p class="mb-1"><strong>Dosis:</strong> ${medicamento.dosis}</p>
//               <p class="mb-1"><strong>Frecuencia:</strong> ${medicamento.frecuencia}</p>
//               <p class="mb-1"><strong>Via de Administración:</strong> ${medicamento.viaAdministracion}</p>
//               <p class="mb-1"><strong>Fecha Inicio:</strong> ${formatearFecha(medicamento.fechaInicio)}</p>
//               <p class="mb-1"><strong>Fecha Fin:</strong> ${formatearFecha(medicamento.fechaFin)}</p>
//             </div>
//          </div>
//       `)
//     });
//   } catch (err) {
//     console.error("Error en ObtenerMedicacionPorResidente:", err);
//     Swal.fire("Error al obtener la medicacion", err.message, "error");
//   }
// }

$(document).on("change", "#residenteSelect", function () {
  const residenteId = this.value;

  $("#mensajeSinMedicacion").addClass("d-none");

  if (residenteId) {
    obtenerMedicamentosPorResidente(residenteId);
  } else {
    $("#contenedorTablaMedicacion").addClass("d-none");
    $("#medicacionPorResidente").empty();
    $("#cardsContainerMedicacion").empty();
  }
});


async function obtenerMedicamentosPorResidente(residenteId) {
  try {
    const contenedorTabla = $("#contenedorTablaMedicacion");
    const tbody = $("#medicacionPorResidente");
    const cards = $("#cardsContainerMedicacion");
    const mensaje = $("#mensajeSinMedicacion");

    const data = await authFetch(`medicaciones?residenteId=${residenteId}`);

    tbody.empty();
    cards.empty();
    mensaje.addClass("d-none");

    const hoy = new Date();
    const unMesAtras = new Date();
    unMesAtras.setMonth(hoy.getMonth() - 1);

    const medicamentosFiltrados = data.filter(m => {
      return new Date(m.fechaFin) >= unMesAtras;
    });

    if (!medicamentosFiltrados.length) {
      contenedorTabla.addClass("d-none");
      mensaje.removeClass("d-none");
      return;
    }

    contenedorTabla.removeClass("d-none");

    $.each(medicamentosFiltrados, function (_, medicamento) {
      tbody.append(`
        <tr>
          <td class="fw-bold">${medicamento.nombreMedicamento}</td>
          <td>${medicamento.dosis}</td>
          <td class="d-none d-sm-table-cell">${medicamento.frecuencia}</td>
          <td>${medicamento.viaAdministracion}</td>
          <td>${formatearFecha(medicamento.fechaInicio)}</td>
          <td>${formatearFecha(medicamento.fechaFin)}</td>
        </tr>
      `);

      cards.append(`
        <div class="col-12">
          <div class="card shadow-sm p-3 mb-2">
            <h5>${medicamento.nombreMedicamento}</h5>
            <p><strong>Dosis:</strong> ${medicamento.dosis}</p>
            <p><strong>Frecuencia:</strong> ${medicamento.frecuencia}</p>
            <p><strong>Vía:</strong> ${medicamento.viaAdministracion}</p>
            <p><strong>Inicio:</strong> ${formatearFecha(medicamento.fechaInicio)}</p>
            <p><strong>Fin:</strong> ${formatearFecha(medicamento.fechaFin)}</p>
          </div>
        </div>
      `);
    });

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo obtener la medicación", "error");
  }
}

