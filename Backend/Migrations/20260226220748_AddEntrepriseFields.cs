using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddEntrepriseFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Competences",
                table: "OffresEmploi",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "OffresEmploi",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IconColor",
                table: "OffresEmploi",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Taille",
                table: "Entreprises",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ville",
                table: "Entreprises",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Competences",
                table: "OffresEmploi");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "OffresEmploi");

            migrationBuilder.DropColumn(
                name: "IconColor",
                table: "OffresEmploi");

            migrationBuilder.DropColumn(
                name: "Taille",
                table: "Entreprises");

            migrationBuilder.DropColumn(
                name: "Ville",
                table: "Entreprises");
        }
    }
}
