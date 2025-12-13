using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CuidadoConect.Models;
using System.Security.Claims;

namespace CuidadoConect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistorialRutinasController : ControllerBase
    {
        private readonly Context _context;

        public HistorialRutinasController(Context context)
        {
            _context = context;
        }

        // GET: api/HistorialRutinas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistorialRutina>>> GetHistorialRutina()
        {
            return await _context.HistorialRutina.ToListAsync();
        }

        // GET: api/HistorialRutinas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HistorialRutina>> GetHistorialRutina(int id)
        {
            var historialRutina = await _context.HistorialRutina.FindAsync(id);

            if (historialRutina == null)
            {
                return NotFound();
            }

            return historialRutina;
        }

        // PUT: api/HistorialRutinas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHistorialRutina(int id, HistorialRutina historialRutina)
        {
            if (id != historialRutina.HistorialId)
            {
                return BadRequest();
            }

            _context.Entry(historialRutina).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HistorialRutinaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Registrar historial cuando un empleado marca la rutina
        [HttpPost("historial")]
        public async Task<IActionResult> RegistrarHistorial([FromBody] RegistrarHistorialDto dto)
        {
            // Rol para validar permisos
            var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;

            // Email del usuario logueado
            var empleadoEmail = HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;

            // Buscar empleado asociado al email
            var empleadoId = await _context.Empleado
                .Where(e => e.Email == empleadoEmail)
                .Select(e => e.Id) // ahora devuelve int
                .FirstOrDefaultAsync();

            if (empleadoId == 0) // porque FirstOrDefault devuelve 0 en int si no encuentra
                return BadRequest("No se encontró empleado asociado al usuario.");

            // Buscar el detalle de rutina
            var detalle = await _context.DetalleRutina
                .Include(d => d.RutinaDiaria)
                .FirstOrDefaultAsync(d => d.DetalleRutinaId == dto.DetalleRutinaId);

            if (detalle == null)
                return NotFound("Detalle de rutina no encontrado.");

            // Crear historial
            var historial = new HistorialRutina
            {
                DetalleRutinaId = dto.DetalleRutinaId,
                EmpleadoId = empleadoId,
                FechaHora = DateTime.Now,
                Completado = dto.Completado,
                Dia = dto.Dia.ToLower()
            };

            _context.HistorialRutina.Add(historial);
            await _context.SaveChangesAsync();

            var historialDto = new HistorialDto
            {
                HistorialId = historial.HistorialId,
                FechaHora = historial.FechaHora.ToString("yyyy-MM-dd HH:mm"),
                Completado = historial.Completado,
                Empleado = empleadoEmail, // podés mostrar el email o después mapear Nombre
                Rutina = detalle.RutinaDiaria?.Descripcion ?? ""
            };
            return Ok(historialDto);
        }

        [HttpGet("historial/{residenteId}")]
        public async Task<IActionResult> ObtenerHistorialPorResidente(int residenteId)
        {
            var historial = await _context.HistorialRutina
                .Include(h => h.DetalleRutina)
                    .ThenInclude(d => d.RutinaDiaria)
                .Include(h => h.DetalleRutina)
                    .ThenInclude(d => d.Residente)
                        .ThenInclude(r => r.Persona)
                .Include(h => h.Empleado)
                    .ThenInclude(e => e.Persona) // Incluimos Persona del Empleado
                .Where(h => h.DetalleRutina.ResidenteId == residenteId && h.Completado)
                .OrderByDescending(h => h.FechaHora)
                .Select(h => new
                {
                    ResidenteId = h.DetalleRutina.ResidenteId,
                    ResidenteNombre = h.DetalleRutina.Residente.Persona.NombreyApellido,
                    RutinaDescripcion = h.DetalleRutina.RutinaDiaria.Descripcion,
                    EmpleadoNombre = h.Empleado != null && h.Empleado.Persona != null
                        ? h.Empleado.Persona.NombreyApellido
                        : "Desconocido", // Nombre completo del empleado
                    FechaHora = h.FechaHora.ToString("dd/MM/yyyy HH:mm"), // formateo la fecha para que muestre en formato 24hs como lo guardamos
                })
                .ToListAsync();

            return Ok(historial);
        }

        // POST: api/HistorialRutinas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<HistorialRutina>> PostHistorialRutina(HistorialRutina historialRutina)
        {
            _context.HistorialRutina.Add(historialRutina);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHistorialRutina", new { id = historialRutina.HistorialId }, historialRutina);
        }

        // DELETE: api/HistorialRutinas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHistorialRutina(int id)
        {
            var historialRutina = await _context.HistorialRutina.FindAsync(id);
            if (historialRutina == null)
            {
                return NotFound();
            }

            _context.HistorialRutina.Remove(historialRutina);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HistorialRutinaExists(int id)
        {
            return _context.HistorialRutina.Any(e => e.HistorialId == id);
        }
    }
}
