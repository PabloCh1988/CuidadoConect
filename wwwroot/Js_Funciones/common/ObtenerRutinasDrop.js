async function ObtenerRutinasDrop() {
    try {
        const data = await authFetch("rutinasdiarias"); // endpoint correcto
        const select = document.getElementById("rutinaSelect");
        const select2 = document.getElementById("rutinaSelect2");
        select.innerHTML = '<option value="" selected disabled>Seleccione una rutina</option>';
        select2.innerHTML = '<option value="" selected disabled>Seleccione una rutina</option>';
        data.forEach(rutina => {
            select.innerHTML += `<option value="${rutina.rutinaId}">${rutina.descripcion}</option>`;
            select2.innerHTML += `<option value="${rutina.rutinaId}">${rutina.descripcion}</option>`;
        });
    } catch (err) {
        console.error("Error al cargar las rutinas:", err);
    }
}