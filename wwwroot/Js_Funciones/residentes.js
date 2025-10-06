//cada botón mantiene su propio contexto.
$(document).on("click", ".ver-perfil", async function () {
  const id = $(this).data("id");
  console.log("ID clickeado:", id);
  await BuscarResidenteId(id);
});

// Función para renderizar las cards
function renderCards(personas) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = ""; // limpiar antes de cargar

  function obtenerBadgeEdad(edad) {
    let clase = "badge-info"; // default

    if (edad >= 80) clase = "badge-danger";
    else if (edad >= 65) clase = "badge-warning";
    else clase = "badge-success";

    return `<span class="badge ${clase} badge-edad">${edad} años</span>`;
  }

  personas.forEach(residente => {
    console.log("ID del residente:", residente.residenteId);
    const card = document.createElement("div");
    const fecha = new Date(residente.fechaIngreso).toLocaleDateString("es-AR");
    card.classList.add("col-lg-4", "col-md-6", "col-sm-6", "col-xs-12", "profile_details", "margin_bottom_30");

    card.innerHTML = `
      <div class="contact_blog">
        <div class="contact_inner">
          <div class="left">
            <h3>${residente.nombreResidente}</h3>
            <p><strong>Edad: </strong>${obtenerBadgeEdad(residente.edad)}</p>
            <p><strong>Fecha de Ingreso: </strong>${fecha}</p>
            <p><strong>Obra Social: </strong>${residente.nombreObraSocial} - ${residente.planObraSocial}</p>
            <ul class="list-unstyled">
              <li><i class="fa fa-envelope-o"></i> : ${residente.emailFamiliar}</li>
              <li><i class="fa fa-phone"></i> : ${residente.contactoEmergencia}</li>
            </ul>
          </div>
          <div class="right">
            <div class="profile_contacts">
              <img class="img-responsive" src="${residente.fotoBase64}" alt="Foto de ${residente.nombreResidente}" />
            </div>
          </div>
          <div class="bottom_list">
            <div class="right_button">
              <button type="button" class="btn btn-success btn-xs">
                <i class="fa fa-user"></i> <i class="fa fa-comments-o"></i>
              </button>
              <button type="button" class="btn btn-primary btn-xs ver-perfil" data-id="${residente.residenteId}">
                <i class="fa fa-user"></i> Ver Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}


// Ejemplo de fetch GET
async function ObtenerResidentes() {
  try {
    const data = await authFetch("residentes"); // ← tu función personalizada
    renderCards(data); // ← asumiendo que es un array de residentes
  } catch (error) {
    console.error("Error al cargar personas:", error);
    document.getElementById("cardsContainer").innerHTML =
      '<p class="text-danger">No se pudieron cargar los residentes.</p>';
  }
}

async function CrearResidente() {
  const personaId = $('#formResidente').data('PersonaId');
  const fechaIngr = document.getElementById("FechaIngreso").value;
  const email = document.getElementById("Email").value;
  const observacion = document.getElementById("Observaciones").value;
  const obraSocial = document.getElementById("ObraSocialId").value;
  const nroAfil = document.getElementById("NroAfiliado").value;
  if (isNaN(personaId)) {
    mensajesError('#errorCrearResidente', null, "Debes seleccionar una persona válida");
    return;
  }
  if (!fechaIngr || email.trim() === "") {
    mensajesError('#errorCrearResidente', null, "La fecha de ingreso y el email son obligatorios");
    return;
  }

  const fechaIngreso = new Date(fechaIngr);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (fechaIngreso > hoy) {
    mensajesError('#errorCrearResidente', null, "La fecha de ingreso no puede ser mayor al día de hoy");
    return;
  }

  const residente = {
    personaId: personaId,
    fechaIngreso: fechaIngr,
    emailFamiliar: email,
    observaciones: observacion,
    obraSocialId: obraSocial,
    nroAfiliado: nroAfil
  };
  try {
    const data = await authFetch("residentes", {
      method: "POST",
      body: JSON.stringify(residente)
    });
    $('#modalResidente').modal('hide');
    document.getElementById("FechaIngreso").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("Observaciones").value = "";
    document.getElementById("ObraSocialId").value = "";
    document.getElementById("NroAfiliado").value = "";
    ObtenerPersonas(); // Actualizar la lista de personas
    console.log("Residente guardado:", data);

    const archivoFoto = document.getElementById("FotoResidente").files[0];
    //Validacion para no superar los 2MB
    // if (archivoFoto && archivoFoto.size > 2 * 1024 * 1024) {
    //   mensajesError('#errorCrearResidente', null, "La imagen no debe superar los 2MB");
    //   return;
    // }
    // if (archivoFoto && archivoFoto.size <= 2 * 1024 * 1024) {
    //   const preview = document.getElementById("previewFoto");
    //   const urlTemporal = URL.createObjectURL(archivoFoto);
    //   preview.src = urlTemporal;
    //   $(preview).hide().fadeIn(300);
    // }
    if (archivoFoto) {
      const formData = new FormData();
      formData.append("foto", archivoFoto);

      const res = await authFetch(`residentes/${data.id}/foto`, {
        method: "POST",
        body: formData
      });
    }

    Swal.fire({
      icon: "success",
      title: "Residente creado correctamente",
      background: '#1295c9',
      color: '#f1f1f1',
      showConfirmButton: false,
      timer: 1500
    });
    preview.src = "";
    preview.style.display = "none";

  } catch (err) {
    console.log("Error al crear el profesional:", err);
    mensajesError('#errorCrearResidente', null, `Error al crear: ${err.message}`);
  }
}


async function BuscarResidenteId(id) {
  function obtenerBadgeEdad(edad) {
    let clase = "badge-info"; // default

    if (edad >= 80) clase = "badge-danger";
    else if (edad >= 65) clase = "badge-warning";
    else clase = "badge-success";

    return `<span class="badge ${clase} badge-edad">${edad} años</span>`;
  }
  try {
    const response = await authFetch(`residentes/${id}`, { method: "GET" });
    const residente = response;

    if (!residente || !residente.residenteId) {
      console.warn("Residente no encontrado con ID:", id);
      return;
    }

    const fecha = new Date(residente.fechaIngreso).toLocaleDateString("es-AR");

    const contenido = `
    <div class="dis_flex center_text">
      <div class="profile_img">
        <img width="180" class="rounded-circle" src="${residente.fotoBase64}" alt="Foto de ${residente.nombreResidente}" />
      </div>
      <div class="profile_contant">
        <h3>${residente.nombreResidente}</h3>
        <p><strong>Edad:</strong> ${obtenerBadgeEdad(residente.edad)}</p>
        <p><strong>Fecha de Ingreso:</strong> ${fecha}</p>
        <p><strong>Observaciones:</strong> ${residente.observaciones}</p>
        <p><strong>Obra Social:</strong> ${residente.nombreObraSocial}</p>
        <ul class="list-unstyled">
          <li><i class="fa fa-envelope-o"></i> : ${residente.emailFamiliar}</li>
          <li><i class="fa fa-phone"></i> : ${residente.contactoEmergencia}</li>
        </ul>
        <!-- Podés agregar más datos aquí -->
      </div>
    </div>
  `;

    document.getElementById("modalPerfilBody").innerHTML = contenido;
    const modal = new bootstrap.Modal(document.getElementById("modalPerfil"));
    modal.show();
  } catch (error) {
    console.error("Error al obtener residente:", error);
    // Podés mostrar un toast o alerta visual acá si querés
  }
}