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
    public class DetallesRutinasController : ControllerBase
    {
        private readonly Context _context;

        public DetallesRutinasController(Context context)
        {
            _context = context;
        }

        // GET: api/DetallesRutinas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DetalleRutina>>> GetDetalleRutina()
        {
            return await _context.DetalleRutina.ToListAsync();
        }

        // GET: api/DetallesRutinas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DetalleRutina>> GetDetalleRutina(int id)
        {
            var detalleRutina = await _context.DetalleRutina.FindAsync(id);

            if (detalleRutina == null)
            {
                return NotFound();
            }

            return detalleRutina;
        }

        // PUT: api/DetallesRutinas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalleRutina(int id, DetalleRutina detalleRutina)
        {
            if (id != detalleRutina.DetalleRutinaId)
            {
                return BadRequest();
            }

            _context.Entry(detalleRutina).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DetalleRutinaExists(id))
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

        // POST: api/DetallesRutinas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DetalleRutina>> PostDetalleRutina(DetalleRutina detalleRutina)
        {
            _context.DetalleRutina.Add(detalleRutina);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalleRutina", new { id = detalleRutina.DetalleRutinaId }, detalleRutina);
        }

        // DELETE: api/DetallesRutinas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetalleRutina(int id)
        {
            var detalleRutina = await _context.DetalleRutina.FindAsync(id);
            if (detalleRutina == null)
            {
                return NotFound();
            }

            _context.DetalleRutina.Remove(detalleRutina);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DetalleRutinaExists(int id)
        {
            return _context.DetalleRutina.Any(e => e.DetalleRutinaId == id);
        }
    }
}
