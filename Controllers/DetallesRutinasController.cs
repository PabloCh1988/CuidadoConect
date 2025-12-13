using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CuidadoConect.Models;
using System.Globalization;

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

        //  Asignar rutina a residente
        [HttpPost("asignar")]
        public async Task<IActionResult> AsignarRutina([FromBody] AsignarRutinaDto detalleRutina)
        {
            var residente = await _context.Residente.FindAsync(detalleRutina.ResidenteId);
            var rutina = await _context.RutinaDiaria.FindAsync(detalleRutina.RutinaId);

            if (residente == null || rutina == null)
                return NotFound("Residente o rutina no encontrados.");

            var detalle = new DetalleRutina
            {
                ResidenteId = detalleRutina.ResidenteId,
                RutinaId = detalleRutina.RutinaId,
                Observaciones = detalleRutina.Observaciones,
                Lunes = detalleRutina.Lunes,
                Martes = detalleRutina.Martes,
                Miercoles = detalleRutina.Miercoles,
                Jueves = detalleRutina.Jueves,
                Viernes = detalleRutina.Viernes,
                Sabado = detalleRutina.Sabado,
                Domingo = detalleRutina.Domingo,
                Hora = detalleRutina.Hora
            };

            _context.DetalleRutina.Add(detalle);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Rutina asignada correctamente", detalle.DetalleRutinaId });
        }

        // Obtener rutinas por residente, organizadas por día de la semana
        [HttpGet("por-residente")]
        public async Task<IActionResult> ObtenerRutinasPorResidente(int residenteId)
        {
            var hoy = DateTime.Today;
            // lunes de esta semana
            var inicioSemana = hoy.AddDays(-(int)hoy.DayOfWeek + (int)DayOfWeek.Monday);
            // domingo de esta semana
            var finSemana = inicioSemana.AddDays(6);

            var residente = await _context.Residente
                .Include(r => r.Persona)
                .Include(r => r.DetallesRutinas)
                    .ThenInclude(d => d.RutinaDiaria)
                .FirstOrDefaultAsync(r => r.Id == residenteId);

            if (residente == null)
                return NotFound("Residente no encontrado");

            var dias = new[] { "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo" };
            var resultadoDias = new List<object>();

            foreach (var dia in dias)
            {
                var rutinas = residente.DetallesRutinas
                    .Where(d =>
                        (dia == "lunes" && d.Lunes) ||
                        (dia == "martes" && d.Martes) ||
                        (dia == "miercoles" && d.Miercoles) ||
                        (dia == "jueves" && d.Jueves) ||
                        (dia == "viernes" && d.Viernes) ||
                        (dia == "sabado" && d.Sabado) ||
                        (dia == "domingo" && d.Domingo))
                    .OrderBy(d => d.Hora)
                    .Select(d => new
                    {
                        d.DetalleRutinaId,
                        RutinaDescripcion = d.RutinaDiaria!.Descripcion,
                        d.Hora,
                        d.Observaciones,
                        Completado = _context.HistorialRutina
                            .Any(h => h.DetalleRutinaId == d.DetalleRutinaId
                                   && h.Dia == dia
                                   && h.FechaHora.Date >= inicioSemana
                                   && h.FechaHora.Date <= finSemana
                                   && h.Completado)
                    })
                    .ToList();

                resultadoDias.Add(new
                {
                    Dia = dia,
                    Rutinas = rutinas
                });
            }

            return Ok(new
            {
                ResidenteId = residente.Id,
                ResidenteNombre = residente.Persona.NombreyApellido,
                Dias = resultadoDias
            });
        }

        [HttpGet("rutinasHoy")]
        public async Task<IActionResult> ObtenerRutinasHoyPendientes()
        {
            var hoy = DateTime.Today;

            // Nombre del día en español, por ej. "lunes"
            var nombreDia = hoy.ToString("dddd", new CultureInfo("es-ES")).ToLower();

            // Traemos todo lo necesario en una sola consulta
            var detalles = await _context.DetalleRutina
                .Include(d => d.RutinaDiaria)
                .Include(d => d.Residente)
                    .ThenInclude(r => r.Persona)
                .ToListAsync();

            // Filtrar por día de hoy
            var activosHoy = detalles
                .Where(d =>
                    (nombreDia == "lunes" && d.Lunes) ||
                    (nombreDia == "martes" && d.Martes) ||
                    (nombreDia == "miércoles" && d.Miercoles) ||
                    (nombreDia == "jueves" && d.Jueves) ||
                    (nombreDia == "viernes" && d.Viernes) ||
                    (nombreDia == "sábado" && d.Sabado) ||
                    (nombreDia == "domingo" && d.Domingo)
                )
                .ToList();

            // Ver si están o no completadas hoy
            var pendientesHoy = activosHoy
                .Select(d => new
                {
                    d.DetalleRutinaId,
                    d.ResidenteId,
                    ResidenteNombre = d.Residente.Persona.NombreyApellido,
                    d.Hora,
                    RutinaDescripcion = d.RutinaDiaria.Descripcion,
                    d.Observaciones,
                    Completado = _context.HistorialRutina
                        .Any(h => h.DetalleRutinaId == d.DetalleRutinaId
                               && h.FechaHora.Date == hoy
                               && h.Completado)
                })
                .Where(x => !x.Completado) // ← SOLO las pendientes
                .OrderBy(x => x.ResidenteNombre)
                .ThenBy(x => x.Hora)
                .ToList();

            return Ok(new
            {
                Dia = nombreDia,
                CantidadPendientes = pendientesHoy.Count,
                Rutinas = pendientesHoy
            });
        }



        [HttpGet("por-rutina-y-dia")]
        public async Task<IActionResult> ObtenerResidentesPorRutinaYDia(int rutinaId, string dia)
        {
            if (string.IsNullOrWhiteSpace(dia))
                return BadRequest("Debe especificar un día válido.");

            dia = dia.ToLower();

            var hoy = DateTime.Today;
            var inicioSemana = hoy.AddDays(-(int)hoy.DayOfWeek + (int)DayOfWeek.Monday);
            var finSemana = inicioSemana.AddDays(6);

            var detalles = await _context.DetalleRutina
                .Include(d => d.Residente)
                    .ThenInclude(r => r.Persona)
                .Include(d => d.RutinaDiaria)
                .Where(d =>
                    d.RutinaId == rutinaId &&
                    (
                        (dia == "lunes" && d.Lunes) ||
                        (dia == "martes" && d.Martes) ||
                        (dia == "miercoles" && d.Miercoles) ||
                        (dia == "jueves" && d.Jueves) ||
                        (dia == "viernes" && d.Viernes) ||
                        (dia == "sabado" && d.Sabado) ||
                        (dia == "domingo" && d.Domingo)
                    )
                )
                .ToListAsync();

            var resultado = detalles
                .OrderBy(d => d.Hora)
                .Select(d => new
                {
                    d.DetalleRutinaId,
                    d.Hora,
                    d.Observaciones,
                    RutinaDescripcion = d.RutinaDiaria!.Descripcion,
                    ResidenteId = d.Residente.Id,
                    ResidenteNombre = d.Residente.Persona.NombreyApellido,
                    Completado = _context.HistorialRutina
                        .Any(h => h.DetalleRutinaId == d.DetalleRutinaId
                               && h.Dia == dia
                               && h.FechaHora.Date >= inicioSemana
                               && h.FechaHora.Date <= finSemana
                               && h.Completado)
                })
                .ToList();

            return Ok(new
            {
                Dia = dia,
                RutinaId = rutinaId,
                RutinaDescripcion = resultado.FirstOrDefault()?.RutinaDescripcion ?? "",
                Residentes = resultado
            });
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
