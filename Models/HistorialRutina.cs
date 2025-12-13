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
    public string Dia { get; set; } = "";
}

public class RegistrarHistorialDto
{
    public int DetalleRutinaId { get; set; }
    public int EmpleadoId { get; set; }
    public bool Completado { get; set; }
    public string Dia { get; set; } = "";
}

// DTO para mostrar historial
public class HistorialDto
{
    public int HistorialId { get; set; }
    public string FechaHora { get; set; }
    public bool Completado { get; set; }
    public string Empleado { get; set; } = "";
    public string Rutina { get; set; } = "";
}