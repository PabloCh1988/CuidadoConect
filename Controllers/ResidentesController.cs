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
            var residentes = await _context.Residente
            .Include(r => r.Persona)
            .Include(r => r.ObraSocial) // ← si ObraSocial es una navegación a Persona
            .Select(r => new ResidenteDto
            {
                ResidenteId = r.Id,
                NombreResidente = r.Persona.NombreyApellido,
                Edad = CalcularEdad(r.Persona.FechaNacimiento),
                FechaIngreso = r.FechaIngreso,
                Observaciones = r.Observaciones,
                ContactoEmergencia = r.Persona.Telefono,
                EmailFamiliar = r.EmailFamiliar,
                FotoBase64 = r.FotoBase64,
                NombreObraSocial = r.ObraSocial.Nombre
            }).ToListAsync();

            return Ok(residentes);
        }
        public static int CalcularEdad(DateTime fechaNacimiento)
        {
            var hoy = DateTime.Today;
            var edad = hoy.Year - fechaNacimiento.Year;

            // Si aún no cumplió años este año, se resta uno
            if (fechaNacimiento.Date > hoy.AddYears(-edad)) edad--;

            return edad;
        }

        // GET: api/Residentes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ResidenteDto>> GetResidente(int id)
        {
            var residente = await _context.Residente
                .Include(r => r.Persona)
                .Include(r => r.ObraSocial)
                .Where(r => r.Id == id)
                .Select(r => new ResidenteDto
                {
                    ResidenteId = r.Id,
                    NombreResidente = r.Persona.NombreyApellido,
                    Edad = CalcularEdad(r.Persona.FechaNacimiento),
                    FechaIngreso = r.FechaIngreso,
                    Observaciones = r.Observaciones,
                    ContactoEmergencia = r.Persona.Telefono,
                    EmailFamiliar = r.EmailFamiliar,
                    FotoBase64 = r.FotoBase64,
                    NombreObraSocial = r.ObraSocial.Nombre,
                    
                })
                .FirstOrDefaultAsync();

            if (residente == null)
            {
                return NotFound();
            }

            return Ok(residente);
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

            var persona = await _context.Persona.FindAsync(residente.PersonaId); // Buscar la persona y asignar rol
            if (persona != null)
            {
                persona.Rol = "Residente"; // Guardar rol en Persona
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetResidente", new { id = residente.Id }, residente);
        }
        //POST PARAA SUBIR IMAGENES
        [HttpPost("{id}/foto")]
        public async Task<IActionResult> SubirFotoBase64(int id, IFormFile foto)
        {
            var residente = await _context.Residente.FindAsync(id);
            if (residente == null) return NotFound();

            using var ms = new MemoryStream();
            await foto.CopyToAsync(ms);
            var bytes = ms.ToArray();
            var base64 = Convert.ToBase64String(bytes);

            // Detectar tipo MIME (opcional)
            var mimeType = foto.ContentType; // ej: "image/jpeg"
            residente.FotoBase64 = $"data:{mimeType};base64,{base64}";

            await _context.SaveChangesAsync();
            return Ok(new { residente.FotoBase64 });
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
