using System.ComponentModel.DataAnnotations;

namespace CuidadoConect.Models;

public class HistorialRutina
{
    [Key]
    public int HistorialId { get; set; }
    public int DetalleRutinaId { get; set; }
    public DetalleRutina? DetalleRutina { get; set; }
    public int EmpleadoId { get; set; }
    public virtual Empleado? Empleado { get; set; }
    public DateTime FechaHora { get; set; }
    public bool Completado { get; set; }
}