using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class CreateDeviceStatusTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "MobileDevices");

            migrationBuilder.AddColumn<int>(
                name: "DeviceStatusId",
                table: "MobileDevices",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DeviceStatusReasonId",
                table: "MobileDevices",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "DeviceStatuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceStatuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DeviceStatusReasons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceStatusReasons", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "DeviceStatusReasons",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "In Inventory" },
                    { 2, "Reserved" },
                    { 3, "In Repair" },
                    { 4, "Pending Disposal" }
                });

            migrationBuilder.InsertData(
                table: "DeviceStatuses",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "In Inventory" },
                    { 2, "Deployed" },
                    { 3, "Disposed" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MobileDevices_DeviceStatusId",
                table: "MobileDevices",
                column: "DeviceStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_MobileDevices_DeviceStatusReasonId",
                table: "MobileDevices",
                column: "DeviceStatusReasonId");

            migrationBuilder.AddForeignKey(
                name: "FK_MobileDevices_DeviceStatusReasons_DeviceStatusReasonId",
                table: "MobileDevices",
                column: "DeviceStatusReasonId",
                principalTable: "DeviceStatusReasons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MobileDevices_DeviceStatuses_DeviceStatusId",
                table: "MobileDevices",
                column: "DeviceStatusId",
                principalTable: "DeviceStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MobileDevices_DeviceStatusReasons_DeviceStatusReasonId",
                table: "MobileDevices");

            migrationBuilder.DropForeignKey(
                name: "FK_MobileDevices_DeviceStatuses_DeviceStatusId",
                table: "MobileDevices");

            migrationBuilder.DropTable(
                name: "DeviceStatuses");

            migrationBuilder.DropTable(
                name: "DeviceStatusReasons");

            migrationBuilder.DropIndex(
                name: "IX_MobileDevices_DeviceStatusId",
                table: "MobileDevices");

            migrationBuilder.DropIndex(
                name: "IX_MobileDevices_DeviceStatusReasonId",
                table: "MobileDevices");

            migrationBuilder.DropColumn(
                name: "DeviceStatusId",
                table: "MobileDevices");

            migrationBuilder.DropColumn(
                name: "DeviceStatusReasonId",
                table: "MobileDevices");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "MobileDevices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
