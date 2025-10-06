async function guardarMedicamento() {
  try {
    const residente = document.getElementById("residenteSelect").value;
    const nombreMedicina = document.getElementById("NombreMedicamento").value;
    const dosisMedic = document.getElementById("Dosis").value;
    const frecuenciaMedic = document.getElementById("Frecuencia").value;
    const via = document.getElementById("ViaAdministracion").value;
    const fechaIn = document.getElementById("FechaInicio").value;
    const fechaOut = document.getElementById("FechaFin").value;

    const medicamento = {
      nombreMedicamento: nombreMedicina,
      dosis: dosisMedic,
      frecuencia: frecuenciaMedic,
      viaAdministracion: via,
      fechaInicio: fechaIn,
      fechaFin: fechaOut,
      residenteId: residente
    }

    const data = await authFetch("medicaciones", {
      method: 'POST',
      body: JSON.stringify(medicamento)
    });
    $("#ModalCrearMedicacion").modal('hide');
    document.getElementById("residenteSelect").value = "";
    document.getElementById("NombreMedicamento").value = "";
    document.getElementById("Dosis").value = "";
    document.getElementById("Frecuencia").value = "";
    document.getElementById("ViaAdministracion").value = "";
    document.getElementById("FechaInicio").value = "";
    document.getElementById("FechaFin").value = "";
    console.log("Medicamento guardado", data);

    Swal.fire({
      icon: "success",
      title: "Medicamento creado correctamente",
      background: '#1295c9',
      color: '#f1f1f1',
      showConfirmButton: false,
      timer: 1500
    });
  } catch (err) {
    console.log("Error al crear el medicamento:", err);
    mensajesError('#errorCrearMedicamento', null, `Error al crear: ${err.message}`);
  }
}

async function VaciarFormularioMedicacion() {
  document.getElementById("NombreMedicamento").value = "";
  document.getElementById("Dosis").value = "";
  document.getElementById("Frecuencia").value = "";
  document.getElementById("ViaAdministracion").value = "";
  document.getElementById("FechaInicio").value = "";
  document.getElementById("FechaFin").value = "";
  $('#errorCrearMedicamento').empty();
}

$(document).on("change", "#residenteSelect", function () {
  const residenteId = this.value;
  if (residenteId) {
    obtenerMedicamentosPorResidente(residenteId);
  } else {
    $("#medicacionPorResidente").empty();
  }
});

async function obtenerMedicamentosPorResidente(residenteId) {
  try {
    console.log("Llamando API con residenteId:", residenteId);
    const data = await authFetch(`medicaciones?residenteId=${residenteId}`);
    console.log("Respuesta API:", data);

    $("#medicacionPorResidente").empty();

    if (!data || data.length === 0) {
      $("#medicacionPorResidente").append("<tr><td colspan='4'>No hay Medicamentos Asignados</td></tr>");
      return;
    }

    // Título del residente
    $.each(data, function (index, medicamento) {
      $("#medicacionPorResidente").append(
        `<tr id="fila-${medicamento.id}">
     <td>${medicamento.nombreMedicamento}</td>
     <td>${medicamento.dosis}</td>
     <td class="d-none d-sm-table-cell">${medicamento.frecuencia}</td>
     <td>${medicamento.viaAdministracion}</td>
     <td>${formatearFecha(medicamento.fechaInicio)}</td>
     <td>${formatearFecha(medicamento.fechaFin)}</td>
    </tr>`
      );
    });
  } catch (err) {
    console.error("Error en ObtenerMedicacionPorResidente:", err);
    Swal.fire("Error al obtener la medicacion", err.message, "error");
  }
}
