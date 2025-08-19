namespace CuidadoConect.Models;
using System;

public class Persona
{
    public int Id { get; set; }
    public string? NombreyApellido { get; set; }
    public DateTime FechaNacimiento { get; set; }
    public SexoPersona Sexo { get; set; }
    public int DNI { get; set; }
    public string? Telefono { get; set; }
    public string? Rol { get; set; }

    public virtual ICollection<Empleado>? Empleados { get; set; }
    public virtual ICollection<Profesional>? Profesionales { get; set; }
    public virtual ICollection<Residente>? Residentes { get; set; }
}

public enum SexoPersona
{
    Masculino = 1,
    Femenino
}