using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class CreateMobileDeviceCategoryTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "MobileDevices");

            migrationBuilder.AddColumn<int>(
                name: "MobileDeviceCategoryId",
                table: "MobileDevices",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "MobileDeviceCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MobileDeviceCategories", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "MobileDeviceCategories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Standard smartphone" },
                    { 2, "Enhanced smartphone" },
                    { 3, "Feature phone" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MobileDevices_MobileDeviceCategoryId",
                table: "MobileDevices",
                column: "MobileDeviceCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_MobileDevices_MobileDeviceCategories_MobileDeviceCategoryId",
                table: "MobileDevices",
                column: "MobileDeviceCategoryId",
                principalTable: "MobileDeviceCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MobileDevices_MobileDeviceCategories_MobileDeviceCategoryId",
                table: "MobileDevices");

            migrationBuilder.DropTable(
                name: "MobileDeviceCategories");

            migrationBuilder.DropIndex(
                name: "IX_MobileDevices_MobileDeviceCategoryId",
                table: "MobileDevices");

            migrationBuilder.DropColumn(
                name: "MobileDeviceCategoryId",
                table: "MobileDevices");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "MobileDevices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
