async function ObtenerRutinas() {
  try {
    const data = await authFetch("rutinasdiarias");
    $("#todasLasRutinas").empty();
    $.each(data, function (index, rutina) {
      $("#todasLasRutinas").append(
        `<tr id="fila-${rutina.rutinaId}">
     <td id="desc-${rutina.rutinaId}">${rutina.descripcion}</td>
     <td>
       <button class='btn btn-outline-success fa fa-pencil' title='Editar' onclick='activarEdicion(${rutina.rutinaId}, "${rutina.descripcion}")'></button>
     </td>
     <td>
       <button class='btn btn-outline-danger fa fa-times' onclick='EliminarRutina(${rutina.rutinaId})'></button>
     </td>
   </tr>`
      );
    });
  } catch (err) {
    console.error("Error en ObtenerRutinas:", err);
    Swal.fire({
      icon: "error",
      title: "Error al obtener rutinas",
      text: err.message,
      background: "#1295c9",
      color: "#f1f1f1",
    });
  }
}


$(document).on("change", "#residenteSelect2", function () {
  // console.log("Residente seleccionado:", this.value);
  const residenteId = this.value;
  if (residenteId) {
    ObtenerRutinasPorResidente(residenteId);
  } else {
    $("#rutinasResidente2").empty();
  }
});

$(document).on("change", "#residenteSelect", function () {
  const residenteId = this.value;
  if (residenteId) {
    ObtenerHistorial(residenteId)
  } else {
    $("#rutinasResidente").empty();
  }
});



async function guardarEdicion(rutinaId) {
  const nuevaDescripcion = document.getElementById(`input-${rutinaId}`).value;

  try {
    await authFetch(`rutinasdiarias/${rutinaId}`, {
      method: "PUT",
      body: JSON.stringify({ rutinaId, descripcion: nuevaDescripcion }),
    });

    Swal.fire({
      icon: "success",
      title: "Rutina actualizada",
      background: "#1295c9",
      color: "#f1f1f1",
      showConfirmButton: false,
      timer: 1200,
    });

    document.getElementById(`desc-${rutinaId}`).innerText = nuevaDescripcion;
  } catch (err) {
    Swal.fire("Error al editar rutina", err.message, "error");
  }
}

function cancelarEdicion(rutinaId, descripcionOriginal) {
  document.getElementById(`desc-${rutinaId}`).innerText = descripcionOriginal;
}

async function guardarRutina() {
  const descripcion = document.getElementById("Descripcion").value;

  if (!descripcion) {
    Swal.fire("Describa una rutina", "", "warning");
    return;
  }

  const rutina = {
    descripcion: descripcion,
  };
  if (rutina == "") {
    return;
  }

  try {
    const data = await authFetch("rutinasdiarias", {
      method: "POST",
      body: JSON.stringify(rutina),
    });
    Swal.fire({
      icon: "success",
      title: "Rutina creada correctamente",
      background: "#1295c9",
      color: "#f1f1f1",
      showConfirmButton: false,
      timer: 1500,
    });
    $("#ModalCrearRutinasDiarias").modal("hide");
    ObtenerRutinas();
    limpiarModalRutina();

    console.log("Rutina guardada:", data);
  } catch (err) {
    console.error("Error en CrearRutina:", err);
    mensajesError("#errorCrear", null, "Error al crear rutina: " + err.message);
  }
}

async function EditarRutina() {
  const id = document.getElementById("editarRutinaId").value;
  const descripcion = document.getElementById("Descripcion").value;

  try {
    const data = await authFetch(`rutinasdiarias/${id}`, {
      method: "PUT",
      body: JSON.stringify({ rutinaId: id, descripcion }),
    });

    Swal.fire({
      icon: "success",
      title: "Rutina editada correctamente",
      background: "#1295c9",
      color: "#f1f1f1",
      showConfirmButton: false,
      timer: 1500,
    });
    $("#ModalCrearRutinasDiarias").modal("hide");
    ObtenerRutinas();
    limpiarModalRutina();
  } catch (err) {
    mensajesError(
      "#errorCrearRutina",
      null,
      "Error al editar rutina: " + err.message
    );
  }
}

function EliminarRutina(id) {
  Swal.fire({
    title: "Estas seguro de eliminar esta rutina?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    background: "#1295c9",
    color: "#f1f1f1",
    showCancelButton: true,
    confirmButtonColor: "#0005d1",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminarla",
  }).then((result) => {
    if (result.isConfirmed) {
      EliminarRutinaSI(id);
    }
  });
}
function EliminarRutinaSI(id) {
  authFetch(`rutinasdiarias/${id}`, { method: "DELETE" })
    .then(() => {
      // Mostrar mensaje de éxito
      Swal.fire({
        title: "Eliminado!",
        text: "La rutina ha sido eliminada.",
        icon: "success",
        background: "#1295c9",
        color: "#f1f1f1",
        showConfirmButton: false,
        timer: 1500,
      });
      ObtenerRutinas();
    })
    .catch((error) =>
      console.error(
        "No se pudo acceder a la api, verifique el mensaje de error: ",
        error
      )
    );
}

// 
async function AsignarRutinaAResidente() {
  const residenteId = parseInt(document.getElementById("residenteSelectRutina").value);
  const rutinaId = parseInt(document.getElementById("rutinaSelect").value);
  const horaInput = document.getElementById("horaRutina").value;
  const hora = horaInput.length === 5 ? horaInput + ":00" : horaInput;
  const observaciones = document.getElementById("observacionesRutina").value;

  if (!rutinaId) {
    // mensajesError('#errorCrearAsigancionRutina', null, "Seleccioná residente y rutina válidos.");
    document.getElementById("errorSelectRutina").textContent = "Seleccioná una rutina.";
    return;
  } else {
    document.getElementById("errorSelectRutina").textContent = "";
  }
  if (!residenteId) {
    document.getElementById("errorSelectResidente").textContent = "Seleccioná un Residente.";
    return;
  } else {
    document.getElementById("errorSelectResidente").textContent = "";
  }

  if (!horaInput) {
    // mensajesError('#errorCrearAsigancionRutina', null, "Seleccioná residente y rutina válidos.");
    document.getElementById("errorTimeRutina").textContent = "Seleccioná una hora.";
    return;
  } else {
    document.getElementById("errorTimeRutina").textContent = "";
  }
  // Se realiza esta constante para validar que seleccione por lo menos un dia para realizar la rutina
  const diasSeleccionados = [
    document.getElementById("chkLunes").checked,
    document.getElementById("chkMartes").checked,
    document.getElementById("chkMiercoles").checked,
    document.getElementById("chkJueves").checked,
    document.getElementById("chkViernes").checked,
    document.getElementById("chkSabado").checked,
    document.getElementById("chkDomingo").checked
  ];

  const alMenosUnDia = diasSeleccionados.some(dia => dia === true);

  if (!alMenosUnDia) {
    // mensajesError('#errorCrearAsigancionRutina', null, "Seleccioná al menos un día para la rutina.");
    // return;
    document.getElementById("errorCrearAsigancionRutina").textContent = "Seleccioná al menos un día para la rutina.";
    return;
  } else {
    document.getElementById("errorCrearAsigancionRutina").textContent = "";
  }

  const detalleRutina = {
    residenteId: residenteId,
    rutinaId: rutinaId,
    observaciones: observaciones,
    hora: hora,
    lunes: document.getElementById("chkLunes").checked,
    martes: document.getElementById("chkMartes").checked,
    miercoles: document.getElementById("chkMiercoles").checked,
    jueves: document.getElementById("chkJueves").checked,
    viernes: document.getElementById("chkViernes").checked,
    sabado: document.getElementById("chkSabado").checked,
    domingo: document.getElementById("chkDomingo").checked
  };

  try {
    const data = await authFetch("detallesrutinas/asignar", {
      method: "POST",
      body: JSON.stringify(detalleRutina),
    });

    Swal.fire({
      icon: "success",
      title: "Rutina asignada al residente",
      background: "#1295c9",
      color: "#f1f1f1",
      showConfirmButton: false,
      timer: 1500,
    });
    ObtenerTodasLasRutinas();
    $("#ModalAsignarRutinaAResidente").modal("hide");

  } catch (err) {
    console.error("Error en AsignarRutinaAResidente:", err);
    Swal.fire({
      icon: "error",
      title: "Error al asignar rutina",
      text: err.message,
      background: "#1295c9",
      color: "#f1f1f1",
    });
  }
}

// async function ObtenerRutinasDeResidente(residenteId, dia) {
//   try {
//     const data = await authFetch(`detallesrutinas/residente/${residenteId}?dia=${dia}`);
//     $("#rutinasResidente").empty();

//     $.each(data, function (index, detalle) {
//       $("#rutinasResidente").append(
//         "<tr>" +
//         "<td>" + detalle.rutinaDescripcion + "</td>" +
//         "<td>" + detalle.hora + "</td>" +
//         "<td>" + (detalle.observaciones ?? "") + "</td>" +
//         "<td>" +
//         (detalle.completado
//           ? "<span class='btn btn-outline-danger'>Completada</span>"
//           : "<button id='btnCompletar_" + detalle.detalleRutinaId + "' class='btn btn-outline-success' onclick='MarcarRutinaCompletada(" + detalle.detalleRutinaId + ")'>Completar</button>"
//         ) +
//         "</td>" +
//         "</tr>"
//       );
//     });
//   } catch (err) {
//     console.error("Error en ObtenerRutinasDeResidente:", err);
//     Swal.fire({
//       icon: "error",
//       title: "Error al obtener rutinas del residente",
//       text: err.message,
//       background: "#1295c9",
//       color: "#f1f1f1",
//     });
//   }
// }


// $(document).ready(async function () {
//   // Cargar residentes al iniciar


//   // Evento para el botón "Ver rutinas"
//   $("#btnCargarRutinas").on("click", function () {
//     const residenteId = $("#residenteSelect").val();

//     if (!residenteId) {
//       Swal.fire("Seleccione un residente", "", "warning");
//       return;
//     }

//     ObtenerHistorial(residenteId);
//   });
// });

async function ObtenerHistorial(residenteId) {
  try {
    const data = await authFetch(`historialrutinas/historial/${residenteId}`);
    $("#tablaHistorial tbody").empty();

    if (data.length === 0) {
      $("#tablaHistorial tbody").append("<tr><td colspan='4'>No hay historial</td></tr>");
      return;
    }

    data.forEach(item => {
      $("#tablaHistorial tbody").append(
        "<tr>" +
        "<td>" + item.rutinaDescripcion + "</td>" +
        "<td>" + item.empleadoNombre + "</td>" +
        "<td>" + new Date(item.fechaHora).toLocaleString() + "</td>" +
        "</tr>"
      );
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


async function MarcarRutinaCompletada(detalleRutinaId, dia) {
  const historial = {
    detalleRutinaId: detalleRutinaId,
    completado: true,
    dia: dia
  };

  try {
    await authFetch("historialrutinas/historial", {
      method: "POST",
      body: JSON.stringify(historial),
    });

    const btn = document.getElementById(`btnCompletar_${detalleRutinaId}_${dia}`);
    if (btn) {
      btn.outerHTML = "<span class='btn btn-outline-danger'>Completada</span>";
    }
  } catch (err) {
    console.error("Error en MarcarRutinaCompletada:", err);
    Swal.fire("Error al completar rutina", err.message, "error");
  }
}



// async function ObtenerTodasLasRutinas() {
//   try {
//     const data = await authFetch("detallesrutinas/todas");
//     $("#rutinasResidente2").empty();

//     // Agrupamos primero por residente
//     const residentes = {};
//     data.forEach(item => {
//       if (!residentes[item.residenteId]) {
//         residentes[item.residenteId] = {
//           nombre: item.residenteNombre,
//           dias: []
//         };
//       }
//       residentes[item.residenteId].dias.push(item);
//     });

//     Object.values(residentes).forEach(residente => {
//       // Fila de título del residente
//       $("#rutinasResidente2").append(
//         `<tr><td colspan="4" class="table-dark fw-bold text-center">
//           ${residente.nombre}
//         </td></tr>`
//       );

//       residente.dias.forEach(diaInfo => {
//         if (diaInfo.rutinas.length > 0) {
//           // Fila del día
//           $("#rutinasResidente2").append(
//             `<tr><td colspan="4" class="table-secondary fw-bold text-center">
//               ${diaInfo.dia.toUpperCase()}
//             </td></tr>`
//           );

//           diaInfo.rutinas.forEach(detalle => {
//             $("#rutinasResidente2").append(
//               `<tr>
//                 <td>${detalle.rutinaDescripcion}</td>
//                 <td>${detalle.hora}</td>
//                 <td>${detalle.observaciones ?? ""}</td>
//                 <td>
//                   ${detalle.completado
//                 ? "<span class='btn btn-outline-danger'>Completada</span>"
//                 : `<button id="btnCompletar_${detalle.detalleRutinaId}_${diaInfo.dia}"
//                           class="btn btn-outline-success"
//                           onclick="MarcarRutinaCompletada(${detalle.detalleRutinaId}, '${diaInfo.dia}')">Completar</button>`
//               }
//                 </td>
//               </tr>`
//             );
//           });
//         }
//       });
//     });
//   } catch (err) {
//     console.error("Error en ObtenerTodasLasRutinas:", err);
//     Swal.fire("Error al obtener todas las rutinas", err.message, "error");
//   }
// }


// async function ObtenerRutinasPorResidente(residenteId) {
//   try {
//     const data = await authFetch(`detallesrutinas/por-residente?residenteId=${residenteId}`);
//     $("#rutinasResidente2").empty();

//     // Título del residente
//     $("#rutinasResidente2").append(
//       `<tr><td colspan="4" class="table-dark fw-bold text-center">
//         ${data.residenteNombre}
//       </td></tr>`
//     );

//     // Recorremos los días
//     data.dias.forEach(diaInfo => {
//       if (diaInfo.rutinas.length > 0) {
//         // Cabecera de día
//         $("#rutinasResidente2").append(
//           `<tr><td colspan="4" class="table-secondary fw-bold text-center">
//             ${diaInfo.dia.toUpperCase()}
//           </td></tr>`
//         );

//         // Rutinas del día
//         diaInfo.rutinas.forEach(detalle => {
//           $("#rutinasResidente2").append(
//             `<tr>
//               <td>${detalle.rutinaDescripcion}</td>
//               <td>${detalle.hora}</td>
//               <td>${detalle.observaciones ?? ""}</td>
//               <td>
//                 ${detalle.completado
//               ? "<span class='btn btn-outline-danger'>Completada</span>"
//               : `<button id="btnCompletar_${detalle.detalleRutinaId}_${diaInfo.dia}"
//                             class="btn btn-outline-success"
//                             onclick="MarcarRutinaCompletada(${detalle.detalleRutinaId}, '${diaInfo.dia}')">
//                             Completar</button>`
//             }
//               </td>
//             </tr>`
//           );
//         });
//       }
//     });
//   } catch (err) {
//     console.error("Error en ObtenerRutinasPorResidente:", err);
//     Swal.fire("Error al obtener rutinas", err.message, "error");
//   }
// }

async function ObtenerRutinasPorResidente(residenteId) {
  try {
    console.log("Llamando API con residenteId:", residenteId);
    const data = await authFetch(`detallesrutinas/por-residente?residenteId=${residenteId}`);
    console.log("Respuesta API:", data);

    $("#rutinasResidente2").empty();

    if (!data || !data.dias) {
      $("#rutinasResidente2").append("<tr><td colspan='4'>No hay rutinas</td></tr>");
      return;
    }

    // Título del residente
    $("#rutinasResidente2").append(
      `<tr><td colspan="4" class="table-dark fw-bold text-center">
        ${data.residenteNombre}
      </td></tr>`
    );

    data.dias.forEach(diaInfo => {
      if (diaInfo.rutinas.length > 0) {
        $("#rutinasResidente2").append(
          `<tr><td colspan="4" class="table-secondary fw-bold text-center">
            ${diaInfo.dia.toUpperCase()}
          </td></tr>`
        );

        diaInfo.rutinas.forEach(detalle => {
          $("#rutinasResidente2").append(
            `<tr>
              <td>${detalle.rutinaDescripcion}</td>
              <td>${detalle.hora}</td>
              <td class="d-none d-sm-table-cell">${detalle.observaciones ?? ""}</td>
              <td>
                ${detalle.completado
              ? "<span class='btn btn-outline-danger'>Completada</span>"
              : `<button id="btnCompletar_${detalle.detalleRutinaId}_${diaInfo.dia}"
                            class="btn btn-outline-success"
                            onclick="MarcarRutinaCompletada(${detalle.detalleRutinaId}, '${diaInfo.dia}')">
                            Completar</button>`
            }
              </td>
            </tr>`
          );
        });
      }
    });
  } catch (err) {
    console.error("Error en ObtenerRutinasPorResidente:", err);
    Swal.fire("Error al obtener rutinas", err.message, "error");
  }
}


// ObtenerTodasLasRutinas();