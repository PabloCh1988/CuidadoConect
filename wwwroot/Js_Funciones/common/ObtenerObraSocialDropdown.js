async function ObtenerObraSocialDropdown() {
    try {
        const data = await authFetch("obrasociales"); // endpoint correcto
        const select = document.getElementById("ObraSocialId");
        select.innerHTML = '<option value="" selected disabled>Seleccione un plan</option>';
        data.forEach(item => {
            select.innerHTML += `<option value="${item.id}">${item.nombre} - ${item.plan}</option>`;
        });
    } catch (err) {
        console.error("Error al cargar obras sociales:", err);
    }
}