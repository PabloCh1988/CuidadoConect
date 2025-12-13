// async function ObtenerResidentesDrop() {
//     try {
//         const data = await authFetch("residentes"); // endpoint correcto
//         const select = document.getElementById("residenteSelect");
//         const select2 = document.getElementById("residenteSelectRutina");
//         const select3 = document.getElementById("residenteSelect2");
//         select.innerHTML = '<option value="" selected disabled>Seleccione un residente</option>';
//         select2.innerHTML = '<option value="" selected disabled>Seleccione un residente</option>';
//         select3.innerHTML = '<option value="" selected disabled>Seleccione un residente</option>';
//         data.forEach(residente => {
//             select.innerHTML += `<option value="${residente.residenteId}">${residente.nombreResidente}</option>`;
//             select2.innerHTML += `<option value="${residente.residenteId}">${residente.nombreResidente}</option>`;
//             select3.innerHTML += `<option value="${residente.residenteId}">${residente.nombreResidente}</option>`;
//         });
//     } catch (err) {
//         console.error("Error al cargar residentes:", err);
//     }
// }

async function ObtenerResidentesDrop() {
    try {
        const data = await authFetch("residentes");

        const selects = [
            document.getElementById("residenteSelect"),
            document.getElementById("residenteSelectRutina"),
            document.getElementById("residenteSelect2")
        ].filter(s => s !== null); // 👉 filtra los que existen

        selects.forEach(select => {
            select.innerHTML = '<option value="" selected disabled>Seleccione un residente</option>';
            data.forEach(residente => {
                select.innerHTML += `<option value="${residente.residenteId}">${residente.nombreResidente}</option>`;
            });
        });

    } catch (err) {
        console.error("Error al cargar residentes:", err);
    }
}
