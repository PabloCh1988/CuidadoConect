async function ObtenerRutinas() {
  try {
    const data = await authFetch("rutinasdiarias");
    $("#todasLasRutinas").empty();
    $.each(data, function (index, rutina) {
      $("#todasLasRutinas").append(
        "<tr>" +
          "<td>" +
          rutina.descripcion +
          "</td>" +
          "<td><button class='btn btn-outline-success fa fa-pencil' title='Editar' onclick='prepararEdición(" +
          rutina.rutinaId +
          ', "' +
          rutina.descripcion +
          "\")'></button></td>" +
          "<td><button class='btn btn-outline-danger fa fa-times' onclick='EliminarRutina(" +
          rutina.rutinaId +
          ")'></button></td>" +
          "</tr>"
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

function prepararEdición(rutinaId, descripcion) {
  document.getElementById("editarRutinaId").value = rutinaId;
  document.getElementById("Descripcion").value = descripcion;
  //   $("#ModalCrearRutinasDiarias").modal("show");
}

function limpiarModalRutina() {
  document.getElementById("editarRutinaId").value = 0;
  document.getElementById("Descripcion").value = "";
}

async function guardarRutina() {
  let RutinaId = document.getElementById("editarRutinaId").value;
  if (RutinaId == 0) {
    CrearRutina();
  } else {
    EditarRutina();
  }
}

async function CrearRutina() {
  const descripcion = document.getElementById("Descripcion").value;

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
