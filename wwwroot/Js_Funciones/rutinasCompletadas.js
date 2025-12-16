function formatearFechaHora(fechaHora) {
    if (!fechaHora) return "";
    const fecha = new Date(fechaHora);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Mes empieza en 0
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}


async function ObtenerHistorial(filtros = {}) {
    try {
        console.log("Filtros enviados:", filtros);

        // Construir body dinámicamente solo con filtros definidos
        const body = {};
        if (filtros.residenteId) body.residenteId = filtros.residenteId;
        if (filtros.fechaDesde) body.filtroFechaDesde = filtros.fechaDesde;
        if (filtros.fechaHasta) body.filtroFechaHasta = filtros.fechaHasta;

        const data = await authFetch("historialrutinas/historialcompletado", {
            method: "POST",
            body: JSON.stringify(body)
        });

        const tbody = $("#tablaHistorial tbody");
        tbody.empty();

        if (!data || data.length === 0) {
            tbody.append(`
        <tr>
          <td colspan="4" class="text-center">
            No hay historial de rutinas
          </td>
        </tr>
      `);
            return;
        }

        data.forEach(item => {
            tbody.append(`
        <tr>
          <td>${item.descripcionRutina}</td>
          <td>${item.nombreEmpleado}</td>
          <td>${formatearFechaHora(item.fechaHora)}</td>
        </tr>
      `);
        });

    } catch (err) {
        console.error("Error en ObtenerHistorial:", err);
        Swal.fire({
            icon: "error",
            title: "Error al obtener historial",
            text: err.message,
            background: "#1295c9",
            color: "#f1f1f1",
        });
    }
}


// Función para obtener los filtros desde los inputs
function obtenerFiltros() {
    return {
        residenteId: $("#residenteSelect").val() || null,
        fechaDesde: $("#FechaDesde").val() || null,
        fechaHasta: $("#FechaHasta").val() || null
    };
}

// Cuando cambie algún filtro, recargar historial
$("#residenteSelect, #FechaDesde, #FechaHasta").on("change", () => {
    const filtros = obtenerFiltros();
    ObtenerHistorial(filtros);
});

// Inicialización al cargar la página
$(document).ready(() => {
    // cargarResidentes();
    ObtenerHistorial(); // carga inicial sin filtros
});