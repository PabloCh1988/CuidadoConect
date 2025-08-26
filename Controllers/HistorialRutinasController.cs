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
