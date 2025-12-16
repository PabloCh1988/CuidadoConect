async function ObtenerRutinasDrop() {
    try {

        const data = await authFetch("rutinasdiarias"); // endpoint correcto

        const select1 = document.getElementById("rutinaSelect");
        const select2 = document.getElementById("rutinaSelect2");

        if (!select1 && !select2) {
            console.warn("No hay selects de rutina en esta vista");
            return;
        }

        if (select1) {
            select1.innerHTML = '<option value="" selected disabled>Seleccione una rutina</option>';
        }

        if (select2) {
            select2.innerHTML = '<option value="" selected disabled>Seleccione una rutina</option>';
        }

        data.forEach(rutina => {
            const option = `<option value="${rutina.rutinaId}">${rutina.descripcion}</option>`;

            if (select1) select1.innerHTML += option;
            if (select2) select2.innerHTML += option;
        });

    } catch (err) {
        console.error("Error al cargar las rutinas:", err);
    }
}
//         const select = document.getElementById("rutinaSelect");
//         const select2 = document.getElementById("rutinaSelect2");

//         select.innerHTML = '<option value="" selected disabled>Seleccione una rutina</option>';
//         if (select2) {
//             select2.innerHTML = '<option value="" selected disabled>Seleccione una rutina</option>';
//         }

//         // select.innerHTML = '<option value="" selected disabled>Seleccione una rutina</option>';
//         // select2.innerHTML = '<option value="" selected disabled>Seleccione una rutina</option>';
//         console.log(data);

//         data.forEach(rutina => {
//             select.innerHTML += `<option value="${rutina.rutinaId}">${rutina.descripcion}</option>`;
//             if (select2) {
//                 select2.innerHTML += `<option value="${rutina.rutinaId}">${rutina.descripcion}</option>`;
//             }
//             // select2.innerHTML += `<option value="${rutina.rutinaId}">${rutina.descripcion}</option>`;
//     });
//     } catch (err) {
//         console.error("Error al cargar las rutinas:", err);
//     }
// }
