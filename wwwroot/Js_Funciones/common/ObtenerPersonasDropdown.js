async function ObtenerPersonasDropdown() {
    const getToken = () => localStorage.getItem("token"); // Obtener el token del localStorage

    const authHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }); // Configurar los headers de autenticación

    const res = await fetch('https://localhost:7065/api/personas', { headers: authHeaders() });
    const personasDropdown = await res.json();
    CompletarDropdown(personasDropdown);
}
function CompletarDropdown(data) {
    $("#PersonaId").empty();
    $.each(data, function(index, item) {
        $('#PersonaId').append(
            "<option value='" + item.id + "'>" + item.nombre + "</option>"
        )
    });

    $("#PersonaIdEditar").empty();
    $.each(data, function(index, item) {
        $('#PersonaIdEditar').append(
            "<option value='" + item.id + "'>" + item.nombre + "</option>"
        )
    });
}