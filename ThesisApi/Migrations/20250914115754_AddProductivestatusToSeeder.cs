using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class AddProductivestatusToSeeder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "DeviceStatusReasons",
                columns: new[] { "Id", "Name" },
                values: new object[] { 5, "Productive" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DeviceStatusReasons",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
