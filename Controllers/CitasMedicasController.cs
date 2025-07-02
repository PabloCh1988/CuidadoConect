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
    }
}
