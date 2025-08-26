using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CuidadoConect.Models;

public class Context : IdentityDbContext<ApplicationUser>
{
    public Context(DbContextOptions<Context> options)
        : base(options)
    {
    }

    public DbSet<CuidadoConect.Models.Persona> Persona { get; set; } = default!;

    public DbSet<CuidadoConect.Models.Profesional> Profesional { get; set; } = default!;

    public DbSet<CuidadoConect.Models.ObraSocial> ObraSocial { get; set; } = default!;

    public DbSet<CuidadoConect.Models.Especialidad> Especialidad { get; set; } = default!;

    public DbSet<CuidadoConect.Models.Empleado> Empleado { get; set; } = default!;

    public DbSet<CuidadoConect.Models.Residente> Residente { get; set; } = default!;

    public DbSet<CuidadoConect.Models.Medicacion> Medicacion { get; set; } = default!;

    public DbSet<CuidadoConect.Models.CitaMedica> CitaMedica { get; set; } = default!;

    public DbSet<CuidadoConect.Models.HistorialMedico> HistorialMedico { get; set; } = default!;


    protected override void OnModelCreating(ModelBuilder modelBuilder) // Configuración de las relaciones para evitar la eliminacion en cascada
    {
        base.OnModelCreating(modelBuilder); // Llama al método base para aplicar las configuraciones predeterminadas

        modelBuilder.Entity<CitaMedica>()
            .HasOne(cm => cm.Residente)// Relación con Residente
            .WithMany(r => r.CitasMedicas) // Especifica la colección inversa
            .HasForeignKey(cm => cm.ResidenteId) // Asegúrate de que ResidenteId es la clave foránea en CitaMedica
            .OnDelete(DeleteBehavior.Restrict); // <- Esto evita el ciclo

        modelBuilder.Entity<HistorialMedico>() // Relación con Residente
        .HasOne(hm => hm.Residente) // Especifica la colección inversa
        .WithMany(r => r.HistorialMedicos) // especifica la colección inversa
        .HasForeignKey(hm => hm.ResidenteId)
        .OnDelete(DeleteBehavior.Restrict);

        // Residente → DetalleRutina (1:N)
        modelBuilder.Entity<Residente>()
            .HasMany(r => r.DetallesRutinas)
            .WithOne(d => d.Residente)
            .HasForeignKey(d => d.ResidenteId)
            .OnDelete(DeleteBehavior.Cascade);


        // RutinaDiaria → DetalleRutina (1:N)
        modelBuilder.Entity<RutinaDiaria>()
            .HasMany(r => r.DetallesRutinas)
            .WithOne(d => d.RutinaDiaria)
            .HasForeignKey(d => d.RutinaId)
            .OnDelete(DeleteBehavior.Cascade);

        // DetalleRutina → HistorialRutina (1:N)
        modelBuilder.Entity<DetalleRutina>()
            .HasMany(d => d.Historiales)
            .WithOne(h => h.DetalleRutina)
            .HasForeignKey(h => h.DetalleRutinaId)
            .OnDelete(DeleteBehavior.Cascade);

        // Empleado → HistorialRutina (1:N)
        modelBuilder.Entity<Empleado>()
            .HasMany<HistorialRutina>() // Si no tenés la colección en Empleado, podés dejarlo así
            .WithOne(h => h.Empleado)
            .HasForeignKey(h => h.EmpleadoId)
            .OnDelete(DeleteBehavior.Restrict); // Para evitar borrado en cascada de empleados

modelBuilder.Entity<Residente>()
    .HasOne(r => r.Persona)
    .WithMany(p => p.Residentes) // 👈 ahora sí coincide con tu modelo
    .HasForeignKey(r => r.PersonaId)
    .OnDelete(DeleteBehavior.Restrict);



        modelBuilder.Entity<Residente>()
            .HasOne(r => r.ObraSocial)
            .WithMany(os => os.Residentes)
            .HasForeignKey(r => r.ObraSocialId)
            .OnDelete(DeleteBehavior.Restrict);

    }

    public DbSet<CuidadoConect.Models.HistorialRutina> HistorialRutina { get; set; } = default!;

    public DbSet<CuidadoConect.Models.RutinaDiaria> RutinaDiaria { get; set; } = default!;

    public DbSet<CuidadoConect.Models.DetalleRutina> DetalleRutina { get; set; } = default!;
}
