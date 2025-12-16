using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuidadoConect.Migrations
{
    /// <inheritdoc />
    public partial class BoolPersonaEliminada : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Eliminada",
                table: "Persona",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }


        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Eliminada",
                table: "Persona");
        }

    }
}
