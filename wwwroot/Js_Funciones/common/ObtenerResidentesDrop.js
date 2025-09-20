async function ObtenerResidentesDrop() {
    try {
        const data = await authFetch("residentes"); // endpoint correcto
        const select = document.getElementById("residenteSelect");
        select.innerHTML = '<option value="" selected disabled>Seleccione un residente</option>';
        data.forEach(residente => {
            select.innerHTML += `<option value="${residente.residenteId}">${residente.nombreResidente}</option>`;
        });
    } catch (err) {
        console.error("Error al cargar residentes:", err);
    }
}