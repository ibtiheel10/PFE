using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddOffreEmploi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OffresEmploi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Titre = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Theme = table.Column<string>(type: "text", nullable: false),
                    DatePublication = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateLimite = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Localisation = table.Column<string>(type: "text", nullable: false),
                    EntrepriseId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OffresEmploi", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OffresEmploi_Utilisateurs_EntrepriseId",
                        column: x => x.EntrepriseId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OffresEmploi_EntrepriseId",
                table: "OffresEmploi",
                column: "EntrepriseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OffresEmploi");
        }
    }
}
