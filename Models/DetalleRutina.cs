using System.Text.Json.Serialization;

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
    
    [JsonIgnore] // evita problemas con nulls
    public ICollection<HistorialRutina> Historiales { get; set; } = [];
}

public class AsignarRutinaDto
{
    public int ResidenteId { get; set; }
    public int RutinaId { get; set; }
    public string? Observaciones { get; set; }
    public bool Lunes { get; set; }
    public bool Martes { get; set; }
    public bool Miercoles { get; set; }
    public bool Jueves { get; set; }
    public bool Viernes { get; set; }
    public bool Sabado { get; set; }
    public bool Domingo { get; set; }
    public TimeOnly Hora { get; set; }
}

public class DetalleRutinaDto
{
    public int DetalleRutinaId { get; set; }
    public string? Observaciones { get; set; }
    public string RutinaDescripcion { get; set; } = "";
    public TimeOnly Hora { get; set; }
    public bool Lunes { get; set; }
    public bool Martes { get; set; }
    public bool Miercoles { get; set; }
    public bool Jueves { get; set; }
    public bool Viernes { get; set; }
    public bool Sabado { get; set; }
    public bool Domingo { get; set; }
    public bool Completado { get; set; }
}
