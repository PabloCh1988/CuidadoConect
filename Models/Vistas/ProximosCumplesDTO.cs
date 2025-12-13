namespace CuidadoConect.Models.Vistas;

public class ProximoCumpleDto
{
    public int ResidenteId { get; set; }
    public string? NombreResidente { get; set; }
    public string? FotoBase64 { get; set; }
    public DateTime FechaCumple { get; set; }
    public int EdadQueCumple { get; set; }
    public int DiasFaltantes { get; set; }
}
