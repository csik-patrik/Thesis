using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class CreateComputersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "MobileDeviceCategories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "MobileDeviceCategories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "MobileDeviceCategories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.CreateTable(
                name: "ComputerCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComputerCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Computers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Hostname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ComputerCategoryId = table.Column<int>(type: "int", nullable: false),
                    SerialNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatusReason = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Computers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Computers_ComputerCategories_ComputerCategoryId",
                        column: x => x.ComputerCategoryId,
                        principalTable: "ComputerCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Computers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Computers_ComputerCategoryId",
                table: "Computers",
                column: "ComputerCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Computers_UserId",
                table: "Computers",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Computers");

            migrationBuilder.DropTable(
                name: "ComputerCategories");

            migrationBuilder.InsertData(
                table: "MobileDeviceCategories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Standard smartphone" },
                    { 2, "Enhanced smartphone" },
                    { 3, "Feature phone" }
                });
        }
    }
}
