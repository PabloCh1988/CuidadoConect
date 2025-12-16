using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CuidadoConect.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using CuidadoConect.Models.Vistas;

namespace CuidadoConect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResidentesController : ControllerBase
    {
        private readonly Context _context;

        private readonly UserManager<ApplicationUser> _userManager;

        public ResidentesController(Context context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Residentes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Residente>>> GetResidente()
        {
            var residentes = await _context.Residente
            .Include(r => r.Persona)
            .Include(r => r.ObraSocial)
            .Where(r => r.Persona.Eliminada == false)
            .Select(r => new ResidenteDto
            {
                ResidenteId = r.Id,
                NombreResidente = r.Persona.NombreyApellido,
                Edad = CalcularEdad(r.Persona.FechaNacimiento),
                FechaIngreso = r.FechaIngreso,
                Observaciones = r.Observaciones,
                ContactoEmergencia = r.Persona.Telefono,
                EmailFamiliar = r.EmailFamiliar,
                FotoBase64 = r.FotoBase64,
                NombreObraSocial = r.ObraSocial.Nombre,
                planObraSocial = r.ObraSocial.Plan // Asegúrate de que 'Plan' es una propiedad de ObraSocial
            }).ToListAsync();

            return Ok(residentes);
        }
        public static int CalcularEdad(DateTime fechaNacimiento)
        {
            var hoy = DateTime.Today;
            var edad = hoy.Year - fechaNacimiento.Year;

            // Si aún no cumplió años este año, se resta uno
            if (fechaNacimiento.Date > hoy.AddYears(-edad)) edad--;

            return edad;
        }

        [HttpGet("deshabilitados")]
        public async Task<ActionResult<IEnumerable<ResidenteDto>>> GetResidentesDeshabilitados()
        {
            var residentes = await _context.Residente
                .Include(r => r.Persona)
                .Include(r => r.ObraSocial)
                .Where(r => r.Persona.Eliminada)
                .Select(r => new ResidenteDto
                {
                    ResidenteId = r.Id,
                    NombreResidente = r.Persona.NombreyApellido,
                    ContactoEmergencia = r.Persona.Telefono,
                    FechaIngreso = r.FechaIngreso,
                    FechaDeshabilitado = (DateTime)r.Persona.FechaDeshabilitado,
                    NombreObraSocial = r.ObraSocial.Nombre
                })
                .ToListAsync();

            return Ok(residentes);
        }


        [HttpPut("habilitar/{residenteId}")]
        public async Task<IActionResult> HabilitarResidente(int residenteId)
        {
            var residente = await _context.Residente
                .Include(r => r.Persona)
                .FirstOrDefaultAsync(r => r.Id == residenteId);

            if (residente == null)
                return NotFound();

            // Habilita a la persona vinculada al residente
            residente.Persona.Eliminada = false;
            residente.Persona.FechaDeshabilitado = null;

            await _context.SaveChangesAsync();

            // return Ok();
            return Ok(new { mensaje = "Residente habilitado" });

        }


        // GET: api/Residentes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ResidenteDto>> GetResidente(int id)
        {
            var residente = await _context.Residente
                .Include(r => r.Persona)
                .Include(r => r.ObraSocial)
                .Where(r => r.Id == id)
                .Select(r => new ResidenteDto
                {
                    ResidenteId = r.Id,
                    NombreResidente = r.Persona.NombreyApellido,
                    Edad = CalcularEdad(r.Persona.FechaNacimiento),
                    FechaIngreso = r.FechaIngreso,
                    Observaciones = r.Observaciones,
                    ContactoEmergencia = r.Persona.Telefono,
                    EmailFamiliar = r.EmailFamiliar,
                    TutorACargo = r.Tutor,
                    FotoBase64 = r.FotoBase64,
                    NombreObraSocial = r.ObraSocial.Nombre,
                    planObraSocial = r.ObraSocial.Plan,
                    nroAfiliado = r.NroAfiliado,
                })
                .FirstOrDefaultAsync();

            if (residente == null)
            {
                return NotFound();
            }

            return Ok(residente);
        }

        [HttpGet("proximos-cumpleanos")]
        public async Task<ActionResult<IEnumerable<ProximoCumpleDto>>> GetProximosCumpleanos()
        {
            var hoy = DateTime.Today;
            var limite = hoy.AddDays(45);

            var residentes = await _context.Residente
                .Include(r => r.Persona)
                .ToListAsync();

            var resultado = residentes
                .Select(r =>
                {
                    var fechaNac = r.Persona.FechaNacimiento;

                    // Cumpleaños para este año
                    var cumpleEsteAnio = new DateTime(hoy.Year, fechaNac.Month, fechaNac.Day);

                    // Si ya pasó este año, usar el próximo
                    if (cumpleEsteAnio < hoy)
                        cumpleEsteAnio = cumpleEsteAnio.AddYears(1);

                    // Edad que va a cumplir
                    int edadNueva = cumpleEsteAnio.Year - fechaNac.Year;

                    // Días faltantes
                    int diasFaltantes = (cumpleEsteAnio - hoy).Days;

                    return new ProximoCumpleDto
                    {
                        ResidenteId = r.Id,
                        NombreResidente = r.Persona.NombreyApellido,
                        FotoBase64 = r.FotoBase64,
                        FechaCumple = cumpleEsteAnio,
                        EdadQueCumple = edadNueva,
                        DiasFaltantes = diasFaltantes
                    };
                })
                .Where(c => c.FechaCumple >= hoy && c.FechaCumple <= limite)
                .OrderBy(c => c.FechaCumple)
                .ToList();

            return Ok(resultado);
        }


        [HttpGet("ver-por-id/{id}")]
        public async Task<ActionResult<Residente>> GetResidenteById(int id)
        {
            var residente = await _context.Residente
                .Include(r => r.Persona)
                .Include(r => r.ObraSocial)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (residente == null)
            {
                return NotFound();
            }

            return Ok(residente);
        }

        // PUT: api/Residentes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutResidente(int id, Residente residente)
        {
            if (id != residente.Id)
                return BadRequest();

            var residenteDb = await _context.Residente.FindAsync(id);
            if (residenteDb == null)
                return NotFound();

            // Validar email duplicado
            var emailExiste = await _context.Residente
                .AnyAsync(r => r.EmailFamiliar == residente.EmailFamiliar && r.Id != id);

            if (emailExiste)
                return BadRequest("El email del familiar ya está en uso por otro residente.");

            // ✔️ Actualizar SOLO los campos editables
            residenteDb.FechaIngreso = residente.FechaIngreso;
            residenteDb.EmailFamiliar = residente.EmailFamiliar;
            residenteDb.Tutor = residente.Tutor;
            residenteDb.Observaciones = residente.Observaciones;
            residenteDb.ObraSocialId = residente.ObraSocialId;
            residenteDb.NroAfiliado = residente.NroAfiliado;


            await _context.SaveChangesAsync();
            // return Ok();
            return Ok(new { mensaje = "Residente editado correctamente" });

        }


        // POST: api/Residentes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Residente>> PostResidente(Residente residente)
        {
            _context.Residente.Add(residente);
            var emailExiste = await _context.Residente
                .AnyAsync(r => r.EmailFamiliar == residente.EmailFamiliar);

            if (emailExiste)
                return BadRequest("El email del familiar ya está en uso por otro residente.");

            var persona = await _context.Persona.FindAsync(residente.PersonaId); // Buscar la persona y asignar rol
            if (persona != null)
            {
                persona.Rol = "Residente"; // Guardar rol en Persona
            }

            await _context.SaveChangesAsync();

            var user = new ApplicationUser
            {
                UserName = residente.EmailFamiliar,
                Email = residente.EmailFamiliar,
                NombreCompleto = persona.NombreyApellido
            };

            var result = await _userManager.CreateAsync(user, "Familiar2025."); // Contraseña por defecto
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "FAMILIAR"); // Asignar rol de Identity
            }
            else
            {
                return BadRequest(result.Errors);
            }

            return CreatedAtAction("GetResidente", new { id = residente.Id }, residente);
        }
        //POST PARA SUBIR IMAGENES
        [HttpPost("{id}/foto")]
        public async Task<IActionResult> SubirFotoBase64(int id, IFormFile foto)
        {
            var residente = await _context.Residente.FindAsync(id);
            if (residente == null) return NotFound();

            using var ms = new MemoryStream();
            await foto.CopyToAsync(ms);
            var bytes = ms.ToArray();
            var base64 = Convert.ToBase64String(bytes);

            // Detectar tipo MIME (opcional)
            var mimeType = foto.ContentType; // ej: "image/jpeg"
            residente.FotoBase64 = $"data:{mimeType};base64,{base64}";

            await _context.SaveChangesAsync();
            return Ok(new { residente.FotoBase64 });
        }

        // PUT: api/Residentes/{id}/foto
        [HttpPut("{id}/foto")]
        public async Task<IActionResult> ActualizarFotoBase64(int id, IFormFile foto)
        {
            var residente = await _context.Residente.FindAsync(id);
            if (residente == null)
                return NotFound("No se encontró el residente.");

            if (foto == null || foto.Length == 0)
                return BadRequest("No se recibió ninguna imagen válida.");

            using var ms = new MemoryStream();
            await foto.CopyToAsync(ms);
            var bytes = ms.ToArray();
            var base64 = Convert.ToBase64String(bytes);

            var mimeType = foto.ContentType; // ej: "image/jpeg"
            residente.FotoBase64 = $"data:{mimeType};base64,{base64}";

            _context.Entry(residente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResidenteExists(id))
                    return NotFound("El residente ya no existe.");
                else
                    throw;
            }

            return Ok(new { message = "Foto actualizada correctamente.", residente.FotoBase64 });
        }



        // DELETE: api/Residentes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResidente(int id)
        {
            var residente = await _context.Residente.FindAsync(id);
            if (residente == null)
            {
                return NotFound();
            }

            _context.Residente.Remove(residente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ResidenteExists(int id)
        {
            return _context.Residente.Any(e => e.Id == id);
        }
    }
}
