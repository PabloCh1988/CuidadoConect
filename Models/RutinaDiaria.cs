namespace CuidadoConect.Models;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class RutinaDiaria
{
    [Key]
    public int RutinaId { get; set; }
    public string? Descripcion { get; set; }
    public virtual ICollection<DetalleRutina>? DetallesRutinas { get; set; }

}