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
    public class MedicacionesController : ControllerBase
    {
        private readonly Context _context;

        public MedicacionesController(Context context)
        {
            _context = context;
        }

        // GET: api/Medicaciones?residenteId=5
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medicacion>>> GetMedicaciones([FromQuery] int? residenteId)
        {
            IQueryable<Medicacion> query = _context.Medicacion;

            if (residenteId.HasValue)
                query = query.Where(m => m.ResidenteId == residenteId.Value);

            var list = await query.ToListAsync();
            return Ok(list);
        }

        // GET: api/Medicaciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Medicacion>> GetMedicacion(int id)
        {
            var medicacion = await _context.Medicacion.FindAsync(id);

            if (medicacion == null)
            {
                return NotFound();
            }

            return medicacion;
        }

        // PUT: api/Medicaciones/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedicacion(int id, Medicacion medicacion)
        {
            if (id != medicacion.Id)
            {
                return BadRequest();
            }

            _context.Entry(medicacion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicacionExists(id))
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

        // POST: api/Medicaciones
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Medicacion>> PostMedicacion(Medicacion medicacion)
        {
            _context.Medicacion.Add(medicacion);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMedicacion", new { id = medicacion.Id }, medicacion);
        }

        // DELETE: api/Medicaciones/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicacion(int id)
        {
            var medicacion = await _context.Medicacion.FindAsync(id);
            if (medicacion == null)
            {
                return NotFound();
            }

            _context.Medicacion.Remove(medicacion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MedicacionExists(int id)
        {
            return _context.Medicacion.Any(e => e.Id == id);
        }
    }
}
