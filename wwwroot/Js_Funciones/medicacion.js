
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

