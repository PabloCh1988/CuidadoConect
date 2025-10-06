async function ObtenerProfesionalesDrop() {
  try {
    const data = await authFetch("profesionales");

    const selects = [
      document.getElementById("profesionalSelect")
    ].filter(s => s !== null);

    selects.forEach(select => {
      select.innerHTML = '<option value="" selected disabled>Seleccione un profesional</option>';
      data.forEach(profesional => {
        select.innerHTML += `<option value="${profesional.id}">
          ${profesional.persona?.nombreyApellido ?? "Sin nombre"} - ${profesional.especialidad?.nombreEspecialidad ?? "Sin especialidad"}
        </option>`;
      });
    });

  } catch (err) {
    console.error("Error al cargar profesionales:", err);
  }
}
