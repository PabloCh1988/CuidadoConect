using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CuidadoConect.Models;

namespace CuidadoConect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfesionalesController : ControllerBase
    {
        private readonly Context _context;

        public ProfesionalesController(Context context)
        {
            _context = context;
        }

        // GET: api/Profesionales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Profesional>>> GetProfesional()
        {
            var profesionales = await _context.Profesional.Include(p => p.Persona).Include(p => p.Especialidad).ToListAsync();// Incluir datos relacionados de Persona y Especialidad
            return Ok(profesionales);
        }

        // GET: api/Profesionales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Profesional>> GetProfesional(int id)
        {
            var profesional = await _context.Profesional.FindAsync(id);

            if (profesional == null)
            {
                return NotFound();
            }

            return profesional;
        }

        // PUT: api/Profesionales/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProfesional(int id, Profesional profesional)
        {
            if (id != profesional.Id)
            {
                return BadRequest();
            }

            _context.Entry(profesional).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProfesionalExists(id))
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

        // POST: api/Profesionales
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Profesional>> PostProfesional(Profesional profesional)
        {
            _context.Profesional.Add(profesional);

            var persona = await _context.Persona.FindAsync(profesional.PersonaId); // Buscar la persona y asignar rol
            if (persona != null)
            {
                persona.Rol = "Profesional"; // Guardar rol en Persona
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProfesional", new { id = profesional.Id }, profesional);
        }


        // DELETE: api/Profesionales/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfesional(int id)
        {
            var profesional = await _context.Profesional.FindAsync(id);
            if (profesional == null)
            {
                return NotFound();
            }

            _context.Profesional.Remove(profesional);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProfesionalExists(int id)
        {
            return _context.Profesional.Any(e => e.Id == id);
        }
    }
}
