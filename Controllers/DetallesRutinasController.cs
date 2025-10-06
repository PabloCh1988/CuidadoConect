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

        // 👉 1. Asignar rutina a residente
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

        // [HttpGet("todas")]
        // public async Task<IActionResult> GetTodasLasRutinas()
        // {
        //     var hoy = DateTime.Today;

        //     var residentes = await _context.Residente.Include(r => r.Persona).Include(r => r.DetallesRutinas).ThenInclude(d => d.RutinaDiaria).ToListAsync();

        //     var resultado = new List<object>();

        //     foreach (var residente in residentes)
        //     {
        //         var dias = new[] { "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo" };

        //         foreach (var dia in dias)
        //         {
        //             var rutinas = residente.DetallesRutinas
        //                 .Where(d =>
        //                     (dia == "lunes" && d.Lunes) ||
        //                     (dia == "martes" && d.Martes) ||
        //                     (dia == "miercoles" && d.Miercoles) ||
        //                     (dia == "jueves" && d.Jueves) ||
        //                     (dia == "viernes" && d.Viernes) ||
        //                     (dia == "sabado" && d.Sabado) ||
        //                     (dia == "domingo" && d.Domingo)).OrderBy(d => d.Hora)
        //                 .Select(d => new
        //                 {
        //                     d.DetalleRutinaId,
        //                     RutinaDescripcion = d.RutinaDiaria!.Descripcion ?? "",
        //                     d.Hora,
        //                     d.Observaciones,
        //                     Completado = _context.HistorialRutina
        //                         .Any(h => h.DetalleRutinaId == d.DetalleRutinaId
        //                                && h.Dia == dia
        //                                && h.FechaHora.Date == hoy
        //                                && h.Completado)
        //                 })
        //                 .ToList();

        //             resultado.Add(new
        //             {
        //                 ResidenteId = residente.Id,
        //                 ResidenteNombre = residente.Persona.NombreyApellido,
        //                 Dia = dia,
        //                 Rutinas = rutinas
        //             });
        //         }
        //     }

        //     return Ok(resultado);
        // }

        // [HttpGet("por-residente")]
        // public async Task<IActionResult> GetRutinasPorResidente(int residenteId)
        // {
        //     var hoy = DateTime.Today;

        //     var residente = await _context.Residente
        //         .Include(r => r.Persona)
        //         .Include(r => r.DetallesRutinas)
        //             .ThenInclude(d => d.RutinaDiaria)
        //         .FirstOrDefaultAsync(r => r.Id == residenteId);

        //     if (residente == null)
        //         return NotFound("Residente no encontrado");

        //     var dias = new[] { "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo" };

        //     var resultado = new List<object>();

        //     foreach (var dia in dias)
        //     {
        //         var rutinas = residente.DetallesRutinas
        //             .Where(d =>
        //                 (dia == "lunes" && d.Lunes) ||
        //                 (dia == "martes" && d.Martes) ||
        //                 (dia == "miercoles" && d.Miercoles) ||
        //                 (dia == "jueves" && d.Jueves) ||
        //                 (dia == "viernes" && d.Viernes) ||
        //                 (dia == "sabado" && d.Sabado) ||
        //                 (dia == "domingo" && d.Domingo))
        //             .OrderBy(d => d.Hora)
        //             .Select(d => new
        //             {
        //                 d.DetalleRutinaId,
        //                 RutinaDescripcion = d.RutinaDiaria!.Descripcion ?? "",
        //                 d.Hora,
        //                 d.Observaciones,
        //                 Completado = _context.HistorialRutina
        //                     .Any(h => h.DetalleRutinaId == d.DetalleRutinaId
        //                            && h.Dia == dia
        //                            && h.FechaHora.Date == hoy
        //                            && h.Completado)
        //             })
        //             .ToList();

        //         resultado.Add(new
        //         {
        //             Dia = dia,
        //             Rutinas = rutinas
        //         });
        //     }

        //     return Ok(new
        //     {
        //         ResidenteId = residente.Id,
        //         ResidenteNombre = residente.Persona.NombreyApellido,
        //         Dias = resultado
        //     });
        // }

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




        // [HttpGet("residente/{residenteId}")]
        // public async Task<IActionResult> GetRutinasPorResidente(int residenteId, [FromQuery] string dia)
        // {
        //     var query = _context.DetalleRutina
        //         .Include(d => d.RutinaDiaria)
        //         .Where(d => d.ResidenteId == residenteId);

        //     // 🔹 Filtrar por día si viene en query string
        //     if (!string.IsNullOrEmpty(dia))
        //     {
        //         dia = dia.ToLower();
        //         query = dia switch
        //         {
        //             "lunes" => query.Where(d => d.Lunes),
        //             "martes" => query.Where(d => d.Martes),
        //             "miercoles" => query.Where(d => d.Miercoles),
        //             "jueves" => query.Where(d => d.Jueves),
        //             "viernes" => query.Where(d => d.Viernes),
        //             "sabado" => query.Where(d => d.Sabado),
        //             "domingo" => query.Where(d => d.Domingo),
        //             _ => query
        //         };
        //     }

        //     // 🔹 Rango de fecha para hoy
        //     var inicioHoy = DateTime.Today;
        //     var finHoy = inicioHoy.AddDays(1);

        //     var rutinas = await query
        //         .Select(d => new DetalleRutinaDto
        //         {
        //             DetalleRutinaId = d.DetalleRutinaId,
        //             RutinaDescripcion = d.RutinaDiaria!.Descripcion ?? "",
        //             Observaciones = d.Observaciones,
        //             Hora = d.Hora,
        //             Lunes = d.Lunes,
        //             Martes = d.Martes,
        //             Miercoles = d.Miercoles,
        //             Jueves = d.Jueves,
        //             Viernes = d.Viernes,
        //             Sabado = d.Sabado,
        //             Domingo = d.Domingo,

        //             // ✅ Completado sólo si existe historial HOY
        //             Completado = _context.HistorialRutina.Any(h => h.DetalleRutinaId == d.DetalleRutinaId && h.Completado && h.FechaHora >= inicioHoy && h.FechaHora < finHoy && h.Dia == dia)

        //         })
        //         .ToListAsync();

        //     return Ok(rutinas);
        // }




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
