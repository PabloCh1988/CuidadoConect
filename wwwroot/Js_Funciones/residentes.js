
// Función para renderizar las cards
function renderCards(personas) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = ""; // limpiar antes de cargar

  personas.forEach(persona => {
    const card = document.createElement("div");
    card.classList.add("col-lg-4", "col-md-6", "col-sm-6", "col-xs-12", "profile_details", "margin_bottom_30");

    card.innerHTML = `
      <div class="contact_blog">
        <div class="contact_inner">
          <div class="left">
            <h3>${persona.nombre}</h3>
            <p><strong>Edad: </strong>${persona.edad} Años</p>
            <p><strong>Fecha de Ingreso: </strong>${persona.fechaIngreso}</p>
            <ul class="list-unstyled">
              <li><i class="fa fa-envelope-o"></i> : ${persona.email}</li>
              <li><i class="fa fa-phone"></i> : ${persona.telefono}</li>
            </ul>
          </div>
          <div class="right">
            <div class="profile_contacts">
              <img class="img-responsive" src="${persona.imagen}" alt="#" />
            </div>
          </div>
          <div class="bottom_list">
            <div class="right_button">
              <button type="button" class="btn btn-success btn-xs">
                <i class="fa fa-user"></i> <i class="fa fa-comments-o"></i>
              </button>
              <button type="button" class="btn btn-primary btn-xs">
                <i class="fa fa-user"></i> Ver Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Ejemplo de fetch GET
fetch("https://localhost:7233/api/personas") // <- tu endpoint
  .then(response => response.json())
  .then(data => {
    // Suponiendo que data es un array de personas
    renderCards(data);
  })
  .catch(error => console.error("Error al cargar personas:", error));

