async function ObtenerEspecialidadesDrop() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage
    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación

    const res = await fetch('https://localhost:7233/api/especialidades', { headers: authHeaders() });
    const especialidades = await res.json();
    CompletarDropdown(especialidades);
}
function CompletarDropdown(data) {
    $("#EspecialidadId").empty();
    $.each(data, function(index, item) {
        $('#EspecialidadId').append(
            "<option value='" + item.id + "'>" + item.nombreEspecialidad + "</option>"
        )
    });

    $("#EspecialidadIdEditar").empty();
    $.each(data, function(index, item) {
        $('#EspecialidadIdEditar').append(
            "<option value='" + item.id + "'>" + item.nombreEspecialidad + "</option>"
        )
    });
}