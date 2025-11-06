using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupLeaderRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "Id", "Name" },
                values: new object[] { 3, "Group leader" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
