
async function ObtenerResidentesDrop() {
    try {
        const data = await authFetch("residentes"); // endpoint correcto

        // Lista de selects a llenar
        const selects = [
            document.getElementById("residenteSelect"),
            document.getElementById("residenteSelectRutina"),
            document.getElementById("residenteSelect2"),
            // document.getElementById("rutinaSelect2")
        ].filter(s => s !== null); // filtra los que existen

        selects.forEach(select => {
            // Vaciar el select primero
            select.innerHTML = "";

            // Opción por defecto
            const optionDefault = document.createElement("option");
            optionDefault.value = "";
            optionDefault.disabled = true;
            optionDefault.selected = true;
            optionDefault.textContent = "Seleccione un residente";
            select.appendChild(optionDefault);

            // Agregar las opciones
            data.forEach(residente => {
                const option = document.createElement("option");
                option.value = residente.residenteId;
                option.textContent = residente.nombreResidente;
                select.appendChild(option);
            });
        });

    } catch (err) {
        console.error("Error al cargar residentes:", err);
    }
}

// Llamar la función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    ObtenerResidentesDrop();
});
