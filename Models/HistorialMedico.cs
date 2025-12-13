namespace CuidadoConect.Models;

public class HistorialMedico
{
    public int Id { get; set; }
    public string? Diagnostico { get; set; }
    public string? Patologias { get; set; }
    public string? Observaciones { get; set; }
    public DateTime FechaConsulta { get; set; }
    public int ResidenteId { get; set; }
    public virtual Residente? Residente { get; set; }
    public int ProfesionalId { get; set; }
    public virtual Profesional? Profesional { get; set; }
}