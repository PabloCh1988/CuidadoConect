namespace CuidadoConect.Models;

using System;

public class Especialidad
{
    public int Id { get; set; }
    public string? NombreEspecialidad { get; set; }
    public virtual ICollection<Profesional>? Profesionales { get; set; }
}