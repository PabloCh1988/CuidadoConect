async function ObtenerEspecialidadesDrop() {
    try {
        const data = await authFetch("especialidades"); // endpoint correcto
        const select = document.getElementById("EspecialidadId");
        select.innerHTML = '<option value="" selected disabled>Seleccione una especialidad</option>';
        data.forEach(especialidad => {
            select.innerHTML += `<option value="${especialidad.id}">${especialidad.nombreEspecialidad}</option>`;
        });
    } catch (err) {
        console.error("Error al cargar especialidades:", err);
    }
}