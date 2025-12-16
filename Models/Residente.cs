namespace CuidadoConect.Models;

public class Residente
{
    public int Id { get; set; }
    public int PersonaId { get; set; }
    public virtual Persona? Persona { get; set; }
    public DateTime FechaIngreso { get; set; }
    public string? Observaciones { get; set; }
    public string? EmailFamiliar { get; set; }
    public string? Tutor { get; set; }
    public int? ObraSocialId { get; set; }
    public virtual ObraSocial? ObraSocial { get; set; }
    public int NroAfiliado { get; set; }
    public string? FotoBase64 { get; set; }
    public virtual ICollection<HistorialMedico> HistorialMedicos { get; set; } = []; // Relación con HistorialMedico
    public virtual ICollection<Medicacion> Medicaciones { get; set; } = [];
    public virtual ICollection<CitaMedica> CitasMedicas { get; set; } = [];
    public virtual ICollection<DetalleRutina> DetallesRutinas { get; set; } = [];
}

public class ResidenteDto
{
    public int ResidenteId { get; set; }
    public string? NombreResidente { get; set; }
    public int Edad { get; set; }
    public DateTime FechaIngreso { get; set; }
    public string? Observaciones { get; set; }
    public string? ContactoEmergencia { get; set; }
    public string? EmailFamiliar { get; set; }
    public string? TutorACargo { get; set; }
    public string? FotoBase64 { get; set; }
    public string? NombreObraSocial { get; set; }

    public string? planObraSocial { get; set; }
    public int nroAfiliado { get; set; }
    public DateTime FechaDeshabilitado { get; set; }
}