namespace CuidadoConect.Models;

public class Profesional
{
    public int Id { get; set; }
    public int PersonaId { get; set; }
    public string? Email { get; set; }
    public virtual Persona? Persona { get; set; }
    public int EspecialidadId { get; set; }
    public virtual Especialidad? Especialidad { get; set; }
    public virtual ICollection<HistorialMedico> HistorialMedico { get; set; } = [];
    public virtual ICollection<Residente> Residentes { get; set; } = [];
    public virtual ICollection<CitaMedica> CitasMedicas { get; set; } = [];
}