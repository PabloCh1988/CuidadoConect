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

async function comboResidentes() {
    const residentes = await authFetch("residentes");

    const comboSelectBuscar = document.querySelector("#residenteSelect");
    comboSelectBuscar.innerHTML = "";

    let opcionesBuscar = `<option value="0">[Todos los Residentes]</option>`;
    residentes.forEach(res => {
        opcionesBuscar += `<option value="${res.residenteId}">${res.nombreResidente}</option>`;
    });

    comboSelectBuscar.innerHTML = opcionesBuscar;
    comboSelectBuscar.onchange = ObtenerHistorial;

    ObtenerHistorial();
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("FechaDesde").onchange = function () {
        ObtenerHistorial();
    }
});
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("FechaHasta").onchange = function () {
        ObtenerHistorial();
    }
});

async function ObtenerHistorial() {
    let fechaDesde = document.getElementById("FechaDesde").value || null;
    let fechaHasta = document.getElementById("FechaHasta").value || null;
    const select = document.getElementById("residenteSelect").value;

    const filtro = {
        FiltroFechaDesde: fechaDesde,
        FiltroFechaHasta: fechaHasta
    };

    if (select !== "0") {
        filtro.ResidenteId = parseInt(select);
    }

    const data = await authFetch("historialrutinas/historialcompletado", {
        method: "POST",
        body: JSON.stringify(filtro)
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
}


comboResidentes();