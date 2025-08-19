using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuidadoConect.Migrations
{
    /// <inheritdoc />
    public partial class MigracionConRolPersona : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Rol",
                table: "Persona",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rol",
                table: "Persona");
        }
    }
}
