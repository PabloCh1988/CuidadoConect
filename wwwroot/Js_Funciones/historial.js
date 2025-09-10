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
