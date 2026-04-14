using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class AddSimCallControlGroupSeeder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "SimCallControlGroups",
                columns: new[] { "Id", "IsDataEnabled", "Name" },
                values: new object[,]
                {
                    { 1, false, "Small" },
                    { 2, false, "Medium" },
                    { 3, true, "Large" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "SimCallControlGroups",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "SimCallControlGroups",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "SimCallControlGroups",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
