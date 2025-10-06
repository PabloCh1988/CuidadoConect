function cargarVista(view) {
  const getToken = localStorage.getItem("token");
  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken}`,
  }); // Configurar los headers de autenticación
  fetch(`../views/${view}.html`)
    .then((res) => res.text())
    .then((html) => {
      const app = document.getElementById("app");
      app.innerHTML = html;
      if (view === "personas") {
        ObtenerPersonas();
        ObtenerEspecialidadesDrop();
        ObtenerObraSocialDropdown();
      } else if (view === "home") {
        ObtenerResidentes();
      } else if (view === "especialidad") {
        ObtenerEspecialidades();
        ObtenerProfesionales();
      } else if (view === "empleado") {
        ObtenerEmpleados();
      } else if (view === "obraSocial") {
        ObtenerObrasSociales();
      } else if (view === "rutinasDiarias") {
        ObtenerRutinas();
        ObtenerRutinasDrop();
        ObtenerResidentesDrop();
        // ObtenerTodasLasRutinas();
      } else if (view === "medicacion") {
        ObtenerResidentesDrop();
      } else if (view === "historialMedico") {
        // ObtenerResidentesDropdown();
        // CargarProfesional();
      } else if (view === "agregarMedicacion") {
        ObtenerResidentesDrop();
      } else if (view === "agregarCitaMedica") {
        ObtenerResidentesDrop();
        ObtenerProfesionalesDrop();
      } else if (view === "historiaClinica") {
        ObtenerResidentesDrop();
        // CargarProfesional();
      }

      // Ejecutar scripts de la vista si los hay
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const scripts = tempDiv.querySelectorAll("script");

      scripts.forEach((script) => {
        const nuevoScript = document.createElement("script");
        if (script.src) {
          nuevoScript.src = script.src;
        } else {
          nuevoScript.textContent = script.textContent;
        }
        document.body.appendChild(nuevoScript);
      });
    });
}

function cargarVistaPorHash() {
  let vista = window.location.hash.replace("#", "") || "home";
  cargarVista(vista);
}

function navigateTo(vista) {
  window.location.hash = vista;
}

// Escuchar cambios en la URL con hash
window.addEventListener("hashchange", cargarVistaPorHash);

// Cargar vista inicial
window.addEventListener("DOMContentLoaded", () => {
  cargarVistaPorHash();
});
