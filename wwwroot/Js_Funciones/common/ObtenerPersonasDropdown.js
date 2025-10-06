async function ObtenerPersonasDropdown() {
    const personasDropdown = await authFetch("personas", {method: 'GET'});
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