using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CuidadoConect.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace CuidadoConect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadosController : ControllerBase
    {
        private readonly Context _context;

        private readonly UserManager<ApplicationUser> _userManager;

        public EmpleadosController(Context context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Empleados
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Empleado>>> GetEmpleado()
        {
            // MUESTRO SOLO LOS EMPLEADOS CUYAS PERSONAS NO ESTÁN ELIMINADAS
            var empleados = await _context.Empleado
            .Include(e => e.Persona)
            .Where(e => e.Persona != null && !e.Persona.Eliminada)
            .ToListAsync();

            return Ok(empleados);
        }

        // GET: api/Empleados/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Empleado>> GetEmpleado(int id)
        {
            var empleado = await _context.Empleado.FindAsync(id);

            if (empleado == null)
            {
                return NotFound();
            }

            return empleado;
        }

        [Authorize(Roles = "ADMINISTRADOR")]
        // PUT: api/Empleados/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmpleado(int id, Empleado empleado)
        {
            if (id != empleado.Id)
            {
                return BadRequest();
            }

            _context.Entry(empleado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmpleadoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(empleado);
        }

        // POST: api/Empleados
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Empleado>> PostEmpleado(Empleado empleado)
        {
            _context.Empleado.Add(empleado);

            // Buscar la persona y asignar rol
            var persona = await _context.Persona.FindAsync(empleado.PersonaId);
            if (persona != null)
            {
                persona.Rol = "Empleado";
            }
            await _context.SaveChangesAsync();

            var user = new ApplicationUser
            {
                UserName = empleado.Email,
                Email = empleado.Email,
                NombreCompleto = persona?.NombreyApellido ?? ""
            };

            var result = await _userManager.CreateAsync(user, "Empleado2025."); // Contraseña por defecto
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "EMPLEADO"); // Asignar rol de Identity
            }
            else
            {
                return BadRequest(result.Errors);
            }

            return CreatedAtAction("GetEmpleado", new { id = empleado.Id }, empleado);
        }

        // DELETE: api/Empleados/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmpleado(int id)
        {
            var empleado = await _context.Empleado.FindAsync(id);
            if (empleado == null)
            {
                return NotFound();
            }

            _context.Empleado.Remove(empleado);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmpleadoExists(int id)
        {
            return _context.Empleado.Any(e => e.Id == id);
        }
    }
}
