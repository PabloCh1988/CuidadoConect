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
    });
  }
}

function activarEdicion(rutinaId, descripcionActual) {
  const celda = document.getElementById(`desc-${rutinaId}`);

  // Evita duplicar inputs si ya está en modo edición
  if (celda.querySelector("input")) return;

  // Crear input con la descripción actual
  const input = document.createElement("input");
  input.type = "text";
  input.value = descripcionActual;
  input.className = "form-control";
  input.id = `input-${rutinaId}`;
  input.style.width = "100%";

  // Botones de acción
  const btnGuardar = document.createElement("button");
  btnGuardar.className = "btn btn-primary btn-sm me-1 mt-2";
  btnGuardar.innerHTML = '<i class="fa fa-check"></i>';
  btnGuardar.onclick = function () {
    guardarEdicion(rutinaId);
  };

  const btnCancelar = document.createElement("button");
  btnCancelar.className = "btn btn-danger btn-sm mt-2";
  btnCancelar.innerHTML = '<i class="fa fa-times"></i>';
  btnCancelar.onclick = function () {
    cancelarEdicion(rutinaId, descripcionActual);
  };

  // Reemplaza contenido por input y botones
  celda.innerHTML = "";
  celda.appendChild(input);
  celda.appendChild(btnGuardar);
  celda.appendChild(btnCancelar);

  // Foco automático
  input.focus();
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
      showConfirmButton: false,
      timer: 1500,
    });
    $("#ModalCrearRutinasDiarias").modal("hide");
    ObtenerRutinas();
    document.getElementById("Descripcion").value = "";

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
      showConfirmButton: false,
      timer: 1500,
    });
    ObtenerRutinas();
    $("#ModalAsignarRutinaAResidente").modal("hide");

  } catch (err) {
    console.error("Error en AsignarRutinaAResidente:", err);
    Swal.fire({
      icon: "error",
      title: "Error al asignar rutina",
      text: err.message,
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
    Swal.fire("Acción Denegada", err.message, "error");
  }
}

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
      `<tr><td colspan="4" class="table-warning fw-bold text-center">
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

async function ObtenerResidentesPorRutina(rutinaId, dia) {
  try {
    console.log(`Buscando residentes para rutina ${rutinaId} el día ${dia}`);
    const data = await authFetch(`detallesrutinas/por-rutina-y-dia?rutinaId=${rutinaId}&dia=${dia}`);

    $("#residentesPorRutina").empty();

    if (!data || !data.residentes || data.residentes.length === 0) {
      $("#residentesPorRutina").append("<tr><td colspan='4'>No hay residentes asignados</td></tr>");
      return;
    }

    // Título
    $("#residentesPorRutina").append(
      `<tr><td colspan="4" class="table-warning fw-bold text-center">
        ${data.rutinaDescripcion.toUpperCase()} - ${data.dia.toUpperCase()}
      </td></tr>`
    );

    data.residentes.forEach(r => {
      $("#residentesPorRutina").append(`
        <tr>
          <td>${r.residenteNombre}</td>
          <td>${r.hora}</td>
          <td class="d-none d-sm-table-cell">${r.observaciones ?? ""}</td>
          <td>
            ${r.completado
          ? "<span class='btn btn-outline-danger'>Completada</span>"
          : `<button id="btnCompletar_${r.detalleRutinaId}_${data.dia}"
                        class="btn btn-outline-success"
                        onclick="MarcarRutinaCompletada(${r.detalleRutinaId}, '${data.dia}')">
                        Completar</button>`}
          </td>
        </tr>
      `);
    });
  } catch (err) {
    console.error("Error en ObtenerResidentesPorRutina:", err);
    Swal.fire("Error al obtener residentes", err.message, "error");
  }
}

document.getElementById("btnBuscarRutina").addEventListener("click", () => {
  const rutinaId = document.getElementById("rutinaSelect2").value;
  const dia = document.getElementById("diaSelect2").value;

  if (!rutinaId || !dia) {
    Swal.fire("Faltan datos", "Seleccione una rutina y un día", "warning");
    return;
  }

  ObtenerResidentesPorRutina(rutinaId, dia);
});

