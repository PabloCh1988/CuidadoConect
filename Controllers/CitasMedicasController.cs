using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CuidadoConect.Models;
using Microsoft.AspNetCore.Authorization;

namespace CuidadoConect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitasMedicasController : ControllerBase
    {
        private readonly Context _context;

        public CitasMedicasController(Context context)
        {
            _context = context;
        }

        // GET: api/CitasMedicas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CitaMedica>>> GetCitaMedica()
        {
            return await _context.CitaMedica.ToListAsync();
        }

        [HttpGet("por-residente")]
        public async Task<IActionResult> ObtenerCitasMedicas(int residenteId)
        {
            var citas = await _context.CitaMedica
                .Include(c => c.Profesional)
                .ThenInclude(p => p.Persona)
                .Where(c => c.ResidenteId == residenteId)
                .OrderByDescending(c => c.Fecha)
                .ToListAsync();

            return Ok(citas);
        }


        // GET: api/CitasMedicas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CitaMedica>> GetCitaMedica(int id)
        {
            var citaMedica = await _context.CitaMedica.FindAsync(id);

            if (citaMedica == null)
            {
                return NotFound();
            }

            return citaMedica;
        }

        // PUT: api/CitasMedicas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCitaMedica(int id, CitaMedica citaMedica)
        {
            if (id != citaMedica.Id)
            {
                return BadRequest();
            }

            _context.Entry(citaMedica).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CitaMedicaExists(id))
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

        // POST: api/CitasMedicas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CitaMedica>> PostCitaMedica(CitaMedica citaMedica)
        {
            _context.CitaMedica.Add(citaMedica);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCitaMedica", new { id = citaMedica.Id }, citaMedica);
        }


        [HttpPost("agendar")]
        public async Task<IActionResult> AgendarCita([FromBody] CitaMedica cita)
        {
            try
            {
                // Estado inicial: Pendiente
                cita.Estado = EstadoCitaMedica.Pendiente;

                _context.CitaMedica.Add(cita);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Cita médica agendada correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Error al agendar la cita", detalle = ex.Message });
            }
        }

        [HttpPut("{id}/estado")]
        public async Task<IActionResult> CambiarEstado(int id, [FromBody] EstadoCitaMedica nuevoEstado)
        {
            var cita = await _context.CitaMedica.FindAsync(id);
            if (cita == null)
                return NotFound();

            cita.Estado = nuevoEstado;
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Estado actualizado" });
        }



        // DELETE: api/CitasMedicas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCitaMedica(int id)
        {
            var citaMedica = await _context.CitaMedica.FindAsync(id);
            if (citaMedica == null)
            {
                return NotFound();
            }

            _context.CitaMedica.Remove(citaMedica);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CitaMedicaExists(int id)
        {
            return _context.CitaMedica.Any(e => e.Id == id);
        }

        [Authorize(Roles = "PROFESIONAL")]
        // Obtener citas del profesional logueado
        [HttpGet("por-profesional")]
        public async Task<IActionResult> ObtenerCitasPorProfesional()
        {
            var email = User.Identity?.Name; // correo del profesional logueado
            if (email == null) return Unauthorized();

            var profesional = await _context.Profesional
                .Include(p => p.Persona)
                .FirstOrDefaultAsync(p => p.Email == email);

            if (profesional == null) return NotFound("Profesional no encontrado");

            var citas = await _context.CitaMedica
                .Include(c => c.Residente)
                .ThenInclude(r => r.Persona)
                .Where(c => c.ProfesionalId == profesional.Id)
                .OrderBy(c => c.Fecha)
                .ThenBy(c => c.Hora)
                .ToListAsync();

            return Ok(citas);
        }

        // Confirmar o cancelar una cita
        [HttpPut("{id}/actualizar-estado")]
        public async Task<IActionResult> ActualizarEstadoCita(int id, [FromBody] EstadoCitaMedica nuevoEstado)
        {
            var cita = await _context.CitaMedica.FindAsync(id);
            if (cita == null) return NotFound("Cita no encontrada");

            cita.Estado = nuevoEstado;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Cita actualizada a {nuevoEstado}" });
        }
    }
}
