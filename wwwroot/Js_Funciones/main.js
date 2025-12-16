function cargarVista(view) {
  const getToken = localStorage.getItem("token");
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
        cargarFechaHoy();
        cargarProximosCumples();
        cargarRutinasHoy();
        mostrarTotalResidentes();
        mostrarTotalEmpleados();
        mostrarTotalProfesionales();
        mostrarTotalObrasSociales();
      } else if (view === "residentes") {
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
      } else if (view === "medicacion") {
        ObtenerResidentesDrop();
      } else if (view === "historialMedico") {
        ObtenerResidentesDrop();
        ObtenerProfesionalesDrop();
      } else if (view === "agregarMedicacion") {
        ObtenerResidentesDrop();
      } else if (view === "agregarCitaMedica") {
        ObtenerResidentesDrop();
        ObtenerProfesionalesDrop();
      } else if (view === "historiaClinica") {
        ObtenerResidentesDrop();
      } else if (view === "verCitasMedicasProfesional") {
        // obtenerCitasProfesional();
        requestAnimationFrame(() => {
          obtenerCitasProfesional();
        });
      } else if(view === "rutinasCompletadas"){
        ObtenerResidentesDrop();
        ObtenerHistorial();
      } else if (view === "buscarPorRutinas") {
        ObtenerRutinasDrop();
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
  // let vista = window.location.hash.replace("#", "") || "home";
  // cargarVista(vista);
  let hash = window.location.hash.replace("#", "") || "home";

  // Ejemplo: perfil?id=2
  let [vista, queryString] = hash.split("?");
  cargarVista(vista);

  // Guardar los parámetros en window.location.search para que perfil.html los pueda leer
  if (queryString) {
    history.replaceState(null, "", window.location.pathname + "?" + queryString + window.location.hash);
  }

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
