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
    public class ResidentesController : ControllerBase
    {
        private readonly Context _context;

        public ResidentesController(Context context)
        {
            _context = context;
        }

        // GET: api/Residentes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Residente>>> GetResidente()
        {
            return await _context.Residente.ToListAsync();
        }

        // GET: api/Residentes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Residente>> GetResidente(int id)
        {
            var residente = await _context.Residente.FindAsync(id);

            if (residente == null)
            {
                return NotFound();
            }

            return residente;
        }

        // PUT: api/Residentes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutResidente(int id, Residente residente)
        {
            if (id != residente.Id)
            {
                return BadRequest();
            }

            _context.Entry(residente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResidenteExists(id))
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

        // POST: api/Residentes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Residente>> PostResidente(Residente residente)
        {
            _context.Residente.Add(residente);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetResidente", new { id = residente.Id }, residente);
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
