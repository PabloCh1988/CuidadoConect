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
    public class RutinasDiariasController : ControllerBase
    {
        private readonly Context _context;

        public RutinasDiariasController(Context context)
        {
            _context = context;
        }

        // GET: api/RutinasDiarias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RutinaDiaria>>> GetRutinaDiaria()
        {
            return await _context.RutinaDiaria.ToListAsync();
        }

        // GET: api/RutinasDiarias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RutinaDiaria>> GetRutinaDiaria(int RutinaId)
        {
            var rutinaDiaria = await _context.RutinaDiaria.FindAsync(RutinaId);

            if (rutinaDiaria == null)
            {
                return NotFound();
            }

            return rutinaDiaria;
        }

        // PUT: api/RutinasDiarias/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRutinaDiaria(int id, RutinaDiaria rutinaDiaria)
        {
            if (id != rutinaDiaria.RutinaId)
            {
                return BadRequest();
            }

            _context.Entry(rutinaDiaria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RutinaDiariaExists(id))
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

        // POST: api/RutinasDiarias
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RutinaDiaria>> PostRutinaDiaria(RutinaDiaria rutinaDiaria)
        {
           
            _context.RutinaDiaria.Add(rutinaDiaria);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRutinaDiaria", new { id = rutinaDiaria.RutinaId }, rutinaDiaria);
        }

        // DELETE: api/RutinasDiarias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRutinaDiaria(int id)
        {
            var rutinaDiaria = await _context.RutinaDiaria.FindAsync(id);
            if (rutinaDiaria == null)
            {
                return NotFound();
            }

            _context.RutinaDiaria.Remove(rutinaDiaria);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RutinaDiariaExists(int id)
        {
            return _context.RutinaDiaria.Any(e => e.RutinaId == id);
        }
    }
}
