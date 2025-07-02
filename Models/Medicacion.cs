namespace CuidadoConect.Models;

public class Medicacion
{
    public int Id { get; set; }
    public string? NombreMedicamento { get; set; }
    public string? Dosis { get; set; }
    public string? Frecuencia { get; set; }
    public string? ViaAdministracion { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public int ResidenteId { get; set; }
    public virtual Residente? Residente { get; set; }
}