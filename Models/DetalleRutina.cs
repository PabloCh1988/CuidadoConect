namespace CuidadoConect.Models;

public class DetalleRutina
{
    public int DetalleRutinaId { get; set; }
    public int RutinaId { get; set; }
    public virtual RutinaDiaria? RutinaDiaria { get; set; }
    public int ResidenteId { get; set; }
    public virtual Residente? Residente { get; set; }
    public string? Observaciones { get; set; }

    public bool Lunes { get; set; }
    public bool Martes { get; set; }
    public bool Miercoles { get; set; }
    public bool Jueves { get; set; }
    public bool Viernes { get; set; }
    public bool Sabado { get; set; }
    public bool Domingo { get; set; }

    public TimeOnly Hora { get; set; }

    public ICollection<HistorialRutina>? Historiales { get; set; }
}