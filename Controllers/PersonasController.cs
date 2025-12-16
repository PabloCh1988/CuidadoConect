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
    public class PersonasController : ControllerBase
    {
        private readonly Context _context;

        public PersonasController(Context context)
        {
            _context = context;
        }

        // GET: api/Personas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Persona>>> GetPersona()
        {
            var personas = await _context.Persona.OrderBy(p => p.NombreyApellido)
            .Where(p => !p.Eliminada).ToListAsync();
            return Ok(personas);
        }

        // MUESTRA LAS PERSONAS DESHABILITADAS
        [HttpGet("deshabilitadas")]
        public async Task<IActionResult> GetPersonasDeshabilitadas()
        {
            var personas = await _context.Persona
                .Where(p => p.Eliminada == true)
                .ToListAsync();

            return Ok(personas);

        }


        // GET: api/Personas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Persona>> GetPersona(int id)
        {
            var persona = await _context.Persona.FindAsync(id);

            if (persona == null)
            {
                return NotFound();
            }

            return persona;
        }
        
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpPut("habilitar/{id}")]
        public async Task<IActionResult> Rehabilitar(int id)
        {
            var persona = await _context.Persona.FindAsync(id);
            if (persona == null) return NotFound();

            persona.Eliminada = false;
            persona.FechaDeshabilitado = null;
            await _context.SaveChangesAsync();

            // return Ok();
            return Ok(new { mensaje = "Persona habilitada correctamente" });

        }


        // PUT: api/Personas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPersona(int id, Persona persona)
        {
            var existePersona = await _context.Persona.Where(p => p.DNI == persona.DNI && p.Id != id).CountAsync(); // Verifica si ya existe una persona con el mismo DNI
            if (existePersona > 0) // si ya existe una persona con el mismo DNI
            {
                return BadRequest("Ya existe una persona con el mismo DNI."); // Retorna un error si ya existe una persona con el mismo DNI
            }
            if (id != persona.Id)
            {
                return BadRequest();
            }

            _context.Entry(persona).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonaExists(id))
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

        // POST: api/Personas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Persona>> PostPersona(Persona persona)
        {
            var existePersona = await _context.Persona.Where(p => p.DNI == persona.DNI).CountAsync(); // Verifica si ya existe una persona con el mismo DNI 
            if (existePersona > 0) // si ya existe una persona con el mismo DNI
            {
                return BadRequest("Ya existe una persona con el mismo DNI."); // Retorna un error si ya existe una persona con el mismo DNI
            }
            _context.Persona.Add(persona);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPersona", new { id = persona.Id }, persona);
        }

        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePersona(int id)
        {
            // Buscar la persona por ID
            var persona = await _context.Persona
                .FirstOrDefaultAsync(p => p.Id == id);

            if (persona == null)
                return NotFound();

            // Marcar como eliminada en lugar de borrar
            persona.Eliminada = true;
            persona.FechaDeshabilitado = DateTime.Now;

            // Guardar cambios
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PersonaExists(int id)
        {
            return _context.Persona.Any(e => e.Id == id);
        }
    }
}
