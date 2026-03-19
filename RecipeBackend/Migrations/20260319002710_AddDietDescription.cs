using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecipeBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddDietDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Diets",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Diets");
        }
    }
}
