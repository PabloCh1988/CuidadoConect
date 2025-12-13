using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuidadoConect.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeletePersonaProfesional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Empleado_Persona_PersonaId",
                table: "Empleado");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorialRutina_Empleado_EmpleadoId",
                table: "HistorialRutina");

            migrationBuilder.DropForeignKey(
                name: "FK_Profesional_Persona_PersonaId",
                table: "Profesional");

            migrationBuilder.AddForeignKey(
                name: "FK_Empleado_Persona_PersonaId",
                table: "Empleado",
                column: "PersonaId",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HistorialRutina_Empleado_EmpleadoId",
                table: "HistorialRutina",
                column: "EmpleadoId",
                principalTable: "Empleado",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Profesional_Persona_PersonaId",
                table: "Profesional",
                column: "PersonaId",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Empleado_Persona_PersonaId",
                table: "Empleado");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorialRutina_Empleado_EmpleadoId",
                table: "HistorialRutina");

            migrationBuilder.DropForeignKey(
                name: "FK_Profesional_Persona_PersonaId",
                table: "Profesional");

            migrationBuilder.AddForeignKey(
                name: "FK_Empleado_Persona_PersonaId",
                table: "Empleado",
                column: "PersonaId",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HistorialRutina_Empleado_EmpleadoId",
                table: "HistorialRutina",
                column: "EmpleadoId",
                principalTable: "Empleado",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Profesional_Persona_PersonaId",
                table: "Profesional",
                column: "PersonaId",
                principalTable: "Persona",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
