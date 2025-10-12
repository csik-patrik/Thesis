using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDepartmentFromSimCards : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Department",
                table: "SimCards");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "SimCards",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
