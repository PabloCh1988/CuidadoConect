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

    public DbSet<CuidadoConect.Models.RutinaDiaria> RutinaDiaria { get; set; } = default!;

    public DbSet<CuidadoConect.Models.Profesional> Profesional { get; set; } = default!;

    public DbSet<CuidadoConect.Models.ObraSocial> ObraSocial { get; set; } = default!;

    public DbSet<CuidadoConect.Models.Especialidad> Especialidad { get; set; } = default!;

    public DbSet<CuidadoConect.Models.Empleado> Empleado { get; set; } = default!;

    public DbSet<CuidadoConect.Models.Residente> Residente { get; set; } = default!;

    public DbSet<CuidadoConect.Models.Medicacion> Medicacion { get; set; } = default!;

    public DbSet<CuidadoConect.Models.CitaMedica> CitaMedica { get; set; } = default!;

    public DbSet<CuidadoConect.Models.HistorialMedico> HistorialMedico { get; set; } = default!;
    public DbSet<CuidadoConect.Models.RutinasPorEmpleado> RutinasPorEmpleado { get; set; } = default!;


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
        
        modelBuilder.Entity<RutinasPorEmpleado>()
                .HasKey(er => er.RutinasPorEmpleadoId); // PK de la tabla intermedia

        modelBuilder.Entity<RutinasPorEmpleado>()
            .HasOne(er => er.Empleado)
            .WithMany(e => e.RutinasPorEmpleados)
            .HasForeignKey(er => er.EmpleadoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RutinasPorEmpleado>()
            .HasOne(er => er.RutinaDiaria)
            .WithMany(r => r.RutinasPorEmpleados)
            .HasForeignKey(er => er.RutinaId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relaciones existentes para Residente
        modelBuilder.Entity<Residente>()
            .HasOne(r => r.RutinaDiaria)
            .WithMany(rd => rd.Residentes)
            .HasForeignKey(r => r.RutinaDiariaId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Residente>()
            .HasOne(r => r.ObraSocial)
            .WithMany(os => os.Residentes)
            .HasForeignKey(r => r.ObraSocialId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}
