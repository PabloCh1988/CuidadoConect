namespace CuidadoConect.Models;
using System;

public class Empleado
{
    public int Id { get; set; }
    public TurnoEmpleado Turno { get; set; }
    public string? TareasAsignadas { get; set; }
    public int PersonaId { get; set; }
    public virtual Persona? Persona { get; set; }
    
}

public enum TurnoEmpleado
{
    Mañana = 1,
    Tarde,
    Noche
}