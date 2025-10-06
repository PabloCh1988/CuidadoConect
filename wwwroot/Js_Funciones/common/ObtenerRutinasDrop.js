async function ObtenerRutinasDrop() {
    try {
        const data = await authFetch("rutinasdiarias"); // endpoint correcto
        const select = document.getElementById("rutinaSelect");
        select.innerHTML = '<option value="" selected disabled>Seleccione una rutina</option>';
        data.forEach(rutina => {
            select.innerHTML += `<option value="${rutina.rutinaId}">${rutina.descripcion}</option>`;
        });
    } catch (err) {
        console.error("Error al cargar las rutinas:", err);
    }
}