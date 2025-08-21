namespace CuidadoConect.Models;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class RutinaDiaria
{
    [Key]
    public int RutinaId { get; set; }
    public string? Descripcion { get; set; }

    public string? Estado { get; set; }
    public virtual ICollection<Residente>? Residentes { get; set; }
    public virtual ICollection<RutinasPorEmpleado>? RutinasPorEmpleados { get; set; }
}