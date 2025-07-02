namespace CuidadoConect.Models;
using System;

public class RutinaDiaria
{
    public int Id { get; set; }
    public string? Descripcion { get; set; }
    public DateTime FechaAsignacion { get; set; }
    public string? Estado { get; set; }
    public int EmpleadoId { get; set; }
    public virtual Empleado? Empleado { get; set; }
    public virtual ICollection<Residente>? Residentes { get; set; }
}