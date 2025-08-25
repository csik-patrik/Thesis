using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class CreateMobileOrdersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MobileOrderId",
                table: "MobileDevices",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "MobileOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomerUsername = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeviceType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeviceCount = table.Column<int>(type: "int", nullable: false),
                    PickupLocation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MobileOrders", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MobileDevices_MobileOrderId",
                table: "MobileDevices",
                column: "MobileOrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_MobileDevices_MobileOrders_MobileOrderId",
                table: "MobileDevices",
                column: "MobileOrderId",
                principalTable: "MobileOrders",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MobileDevices_MobileOrders_MobileOrderId",
                table: "MobileDevices");

            migrationBuilder.DropTable(
                name: "MobileOrders");

            migrationBuilder.DropIndex(
                name: "IX_MobileDevices_MobileOrderId",
                table: "MobileDevices");

            migrationBuilder.DropColumn(
                name: "MobileOrderId",
                table: "MobileDevices");
        }
    }
}
