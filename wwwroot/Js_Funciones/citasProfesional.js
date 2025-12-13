async function obtenerCitasProfesional() {
  try {
    const data = await authFetch("citasmedicas/por-profesional");

    const contenedor = document.getElementById("cardsContainerCitasProfesional");
    contenedor.innerHTML = "";

    if (!data || data.length === 0) {
      contenedor.innerHTML = "<div class='text-center'>No tienes citas asignadas.</div>";
      return;
    }

    data.forEach(cita => {
      contenedor.innerHTML += `
        <div id="cita-${cita.id}" class="col-md-4 mb-3">
          <div class="card shadow-sm p-3 contact_inner">
            <h3>${cita.residente?.persona?.nombreyApellido ?? "Sin nombre"}</h3>
            <p><strong>Fecha:</strong> ${formatearFecha(cita.fecha)}</p>
            <p><strong>Hora:</strong> ${cita.hora}</p>
            <p><strong>Estado:</strong> 
              <span class="badge2 ${getBadgeClass(cita.estado)}">${cita.estado}</span>
            </p>
            <p><strong>Observaciones:</strong> ${cita.observaciones ?? "-"}</p>

            <div class="d-flex justify-content-between mt-3">
              ${cita.estado === "Pendiente" ? `
                <button class="btn btn-outline-success btn-sm" 
                  onclick="actualizarEstadoCita(${cita.id}, 'Confirmada')">
                  Confirmar
                </button>
              ` : cita.estado === "Confirmada" ? `
                <button class="btn btn-outline-primary btn-sm" 
                  onclick="actualizarEstadoCita(${cita.id}, 'Completada')">
                  Completar
                </button>
              ` : ''}

              <button class="btn btn-outline-danger btn-sm" 
                onclick="actualizarEstadoCita(${cita.id}, 'Cancelada')"
                ${cita.estado === "Cancelada" || cita.estado === "Completada" ? "disabled" : ""}>
                Cancelar
              </button>
            </div>

          </div>
        </div>`;
    });

  } catch (err) {
    console.error("Error al obtener citas del profesional:", err);
    Swal.fire("Error", "No tiene acceso a las citas médicas.", "error");
  }
}

async function actualizarEstadoCita(id, nuevoEstado) {
  try {
    // Ajusta el body según lo que espere tu API; la convención común es { estado: 'Confirmada' }
    await authFetch(`citasmedicas/${id}/actualizar-estado`, {
      method: "PUT",
      // headers: {
      //   "Content-Type": "application/json"
      // },
      body: JSON.stringify(nuevoEstado)
    });

    Swal.fire({
      icon: "success",
      title: `Cita ${nuevoEstado.toLowerCase()} correctamente`,
      timer: 1500,
      showConfirmButton: false
    });

    // Recargo las citas para reflejar cambios
    obtenerCitasProfesional();

  } catch (err) {
    console.error("Error al actualizar cita:", err);
    Swal.fire("Error", "No se pudo actualizar la cita.", "error");
  }
}

function getBadgeClass(estado) {
  switch (estado) {
    case "Pendiente":
      return "<button type='button' class='btn btn-outline-warning btn-sm' disabled>Pendiente</button>";
    case "Confirmada":
      return "<button type='button' class='btn btn-outline-success btn-sm' disabled>Confirmada</button>";
    case "Cancelada":
      return "<button type='button' class='btn btn-outline-danger btn-sm' disabled>Cancelada</button>";
    case "Completada":
      return "<button type='button' class='btn btn-outline-primary btn-sm' disabled>Completada</button>";
    default:
      return "<button type='button' class='btn btn-outline-light text-dark btn-sm' disabled>Desconocido</button>";
  }
}

