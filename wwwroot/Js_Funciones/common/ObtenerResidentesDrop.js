async function ObtenerResidentesDrop() {
    try {
        const data = await authFetch("residentes");

        // Configuración por select
        const configs = [
            {
                id: "residenteSelect",
                incluirTodos: true,
                textoDefault: "Todos los residentes"
            },
            {
                id: "residenteSelectRutina",
                incluirTodos: false,
                textoDefault: "Seleccione un residente"
            },
            {
                id: "residenteSelect2",
                incluirTodos: false,
                textoDefault: "Seleccione un residente"
            }
        ];

        configs.forEach(cfg => {
            const select = document.getElementById(cfg.id);
            if (!select) return;

            select.innerHTML = "";

            // Opción por defecto
            const optionDefault = document.createElement("option");
            optionDefault.value = "";
            optionDefault.textContent = cfg.textoDefault;
            optionDefault.selected = true;

            //  solo deshabilitamos cuando NO hay "Todos"
            if (!cfg.incluirTodos) {
                optionDefault.disabled = true;
            }

            select.appendChild(optionDefault);

            // Opciones reales
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
