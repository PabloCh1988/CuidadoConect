namespace CuidadoConect.Models;

public class CitaMedica
{
    public int Id { get; set; }
    public DateTime Fecha { get; set; }
    public string? Hora { get; set; }
    public string? Estado { get; set; }
    public string? Observaciones { get; set; }
    public int ProfesionalId { get; set; }
    public virtual Profesional? Profesional { get; set; }
    public int ResidenteId { get; set; }
    public virtual Residente? Residente { get; set; }
}