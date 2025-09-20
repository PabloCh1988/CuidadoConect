// async function ObtenerResidentesDrop() {
//   try {
//     const data = await authFetch("residentes"); // endpoint correcto
//     const select = document.getElementById("residenteSelect");
//     select.innerHTML = '<option value="" selected disabled>Seleccione un residente</option>';
//     data.forEach(residente => {
//       select.innerHTML += `<option value="${residente.residenteId}">${residente.nombreResidente}</option>`;
//     });
//   } catch (err) {
//     console.error("Error al cargar residentes:", err);
//   }
// }

// $('#ModalCrearMedicacion').on('shown.bs.modal', function () {
//   ObtenerResidentesDrop();
// });

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

async function obtenerMedicamentosPorResidente(residenteId) {
  try {
    const medicamentos = await authFetch(`medicaciones?residenteId=${residenteId}`);
    return medicamentos;
  } catch (err) {
    console.error("Error al obtener medicamentos:", err);
    return [];
  }
}

// const medicamentos = await authFetch(`residentes/${residenteId}/medicaciones`);
function obtenerBadgeVia(via) {
  const clases = {
    "Oral": "badge-success",
    "Intravenosa": "badge-danger",
    "Tópica": "badge-warning text-dark"
  };
  return `<span class="${clases[via] || 'badge bg-secondary'}">${via}</span>`;
}

async function renderizarResidentesConBoton() {
  try {
    const residentes = await authFetch("residentes");
    const container = document.getElementById("cardsContainerMedicamentos");
    container.innerHTML = "";

    residentes.forEach(residente => {
      const card = document.createElement("div");
      card.className = "card mb-3 shadow-sm";
      card.classList.add("col-lg-4", "col-md-6", "col-sm-6", "col-xs-12", "profile_details", "margin_bottom_20");

      card.innerHTML = `
        <div class="row g-0 align-items-center">
          <div class="col-md-6 text-center">
            <img src="${residente.fotoBase64}" alt="Foto de ${residente.nombreResidente}" class="img-fluid rounded-circle m-2" width="100">
          </div>
          <div class="col-md-6">
            <div class="card-body">
              <h5 class="card-title">${residente.nombreResidente}</h5>
            </div>
          </div>
          <div class="col-md-3 text-center">
            <button class="btn btn-info m-2" onclick='mostrarPerfilConMedicamentos(${JSON.stringify(residente)})'>
              Ver Medicación
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error("Error al cargar residentes:", err);
    document.getElementById("cardsContainerMedicamentos").innerHTML = `
      <div class="alert alert-danger">No se pudieron cargar los residentes.</div>
    `;
  }
}

function mostrarMedicamentosEnModal(html) {
  document.getElementById("modalMedicamentosBody").innerHTML = html;
  $("#modalMedicamentos").modal("show");
}

async function mostrarPerfilConMedicamentos(residente) {

  const medicamentos = await obtenerMedicamentosPorResidente(residente.residenteId);
  const listaMedicamentos = medicamentos.map(med => `
    <div class="card mb-2 shadow-sm">
      <div class="card-body">
        <h5 class="card-title">${med.nombreMedicamento}</h5>
        <p class="card-text">
          <strong>Dosis:</strong> ${med.dosis}<br>
          <strong>Frecuencia:</strong> ${med.frecuencia}<br>
          <strong>Vía:</strong> ${obtenerBadgeVia(med.viaAdministracion)}
          <strong>Inicio:</strong> ${med.fechaInicio}<br>
          <strong>Fin:</strong> ${med.fechaFin}
        </p>
      </div>
    </div>
  `).join("");

  const contenido = `
    <div class="dis_flex center_text">
      
      <div class="profile_contant">
        <h3>${residente.nombreResidente}</h3>

        <hr>
        ${listaMedicamentos || "<p class='text-muted'>No hay medicamentos registrados.</p>"}
      </div>
    </div>
  `;
  mostrarMedicamentosEnModal(contenido);

}


