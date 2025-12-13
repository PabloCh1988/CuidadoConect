using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuidadoConect.Migrations
{
    /// <inheritdoc />
    public partial class AddCascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetalleRutina_Residente_ResidenteId",
                table: "DetalleRutina");

            migrationBuilder.DropForeignKey(
                name: "FK_DetalleRutina_RutinaDiaria_RutinaId",
                table: "DetalleRutina");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorialRutina_DetalleRutina_DetalleRutinaId",
                table: "HistorialRutina");

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleRutina_Residente_ResidenteId",
                table: "DetalleRutina",
                column: "ResidenteId",
                principalTable: "Residente",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleRutina_RutinaDiaria_RutinaId",
                table: "DetalleRutina",
                column: "RutinaId",
                principalTable: "RutinaDiaria",
                principalColumn: "RutinaId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HistorialRutina_DetalleRutina_DetalleRutinaId",
                table: "HistorialRutina",
                column: "DetalleRutinaId",
                principalTable: "DetalleRutina",
                principalColumn: "DetalleRutinaId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetalleRutina_Residente_ResidenteId",
                table: "DetalleRutina");

            migrationBuilder.DropForeignKey(
                name: "FK_DetalleRutina_RutinaDiaria_RutinaId",
                table: "DetalleRutina");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorialRutina_DetalleRutina_DetalleRutinaId",
                table: "HistorialRutina");

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleRutina_Residente_ResidenteId",
                table: "DetalleRutina",
                column: "ResidenteId",
                principalTable: "Residente",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleRutina_RutinaDiaria_RutinaId",
                table: "DetalleRutina",
                column: "RutinaId",
                principalTable: "RutinaDiaria",
                principalColumn: "RutinaId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HistorialRutina_DetalleRutina_DetalleRutinaId",
                table: "HistorialRutina",
                column: "DetalleRutinaId",
                principalTable: "DetalleRutina",
                principalColumn: "DetalleRutinaId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
