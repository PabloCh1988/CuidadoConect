namespace CuidadoConect.Models;
using System;

public class ObraSocial
{
    public int Id { get; set; }
    public string? Nombre { get; set; }
    public string? Plan { get; set; }

    public virtual ICollection<Residente> Residentes { get; set; } = [];
}