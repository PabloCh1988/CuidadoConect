namespace CuidadoConect.Models;

using System.Collections.Generic;
using System;

public class RutinasPorEmpleado

{
    public int RutinasPorEmpleadoId { get; set; }
    public int EmpleadoId { get; set; }
    public virtual Empleado? Empleado { get; set; }

    public int RutinaId { get; set; }
    public virtual RutinaDiaria? RutinaDiaria { get; set; }

    // Campos extra útiles para la agenda
    public DateTime FechaAsignacion { get; set; } = DateTime.Now;
    public string? Observaciones { get; set; }
}