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
    public class ObraSocialesController : ControllerBase
    {
        private readonly Context _context;

        public ObraSocialesController(Context context)
        {
            _context = context;
        }

        // GET: api/ObraSociales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ObraSocial>>> GetObraSocial()
        {
            return await _context.ObraSocial.ToListAsync();
        }

        // GET: api/ObraSociales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ObraSocial>> GetObraSocial(int id)
        {
            var obraSocial = await _context.ObraSocial.FindAsync(id);

            if (obraSocial == null)
            {
                return NotFound();
            }

            return obraSocial;
        }

        // PUT: api/ObraSociales/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutObraSocial(int id, ObraSocial obraSocial)
        {
            if (id != obraSocial.Id)
            {
                return BadRequest();
            }

            _context.Entry(obraSocial).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ObraSocialExists(id))
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

        // POST: api/ObraSociales
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ObraSocial>> PostObraSocial(ObraSocial obraSocial)
        {
            _context.ObraSocial.Add(obraSocial);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetObraSocial", new { id = obraSocial.Id }, obraSocial);
        }

        // DELETE: api/ObraSociales/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteObraSocial(int id)
        {
            var obraSocial = await _context.ObraSocial.FindAsync(id);
            if (obraSocial == null)
            {
                return NotFound();
            }

            // Antes de eliminar la obra social
            var residentes = await _context.Residente.Where(r => r.ObraSocialId == id).ToListAsync();
            foreach (var r in residentes)
            {
                r.ObraSocialId = null;
            }

            await _context.SaveChangesAsync();

            // Ahora sí, eliminar la obra social
            _context.ObraSocial.Remove(obraSocial);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ObraSocialExists(int id)
        {
            return _context.ObraSocial.Any(e => e.Id == id);
        }
    }
}
