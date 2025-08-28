using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class AddNewFieldsToMobileOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MobileDevices_MobileOrders_MobileOrderId",
                table: "MobileDevices");

            migrationBuilder.DropIndex(
                name: "IX_MobileDevices_MobileOrderId",
                table: "MobileDevices");

            migrationBuilder.DropColumn(
                name: "DeviceCount",
                table: "MobileOrders");

            migrationBuilder.DropColumn(
                name: "MobileOrderId",
                table: "MobileDevices");

            migrationBuilder.AddColumn<string>(
                name: "CallControlGroup",
                table: "MobileOrders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomersCostCenter",
                table: "MobileOrders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MobileDeviceId",
                table: "MobileOrders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "MobileOrders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RequesterName",
                table: "MobileOrders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RequesterUsername",
                table: "MobileOrders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_MobileOrders_MobileDeviceId",
                table: "MobileOrders",
                column: "MobileDeviceId");

            migrationBuilder.AddForeignKey(
                name: "FK_MobileOrders_MobileDevices_MobileDeviceId",
                table: "MobileOrders",
                column: "MobileDeviceId",
                principalTable: "MobileDevices",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MobileOrders_MobileDevices_MobileDeviceId",
                table: "MobileOrders");

            migrationBuilder.DropIndex(
                name: "IX_MobileOrders_MobileDeviceId",
                table: "MobileOrders");

            migrationBuilder.DropColumn(
                name: "CallControlGroup",
                table: "MobileOrders");

            migrationBuilder.DropColumn(
                name: "CustomersCostCenter",
                table: "MobileOrders");

            migrationBuilder.DropColumn(
                name: "MobileDeviceId",
                table: "MobileOrders");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "MobileOrders");

            migrationBuilder.DropColumn(
                name: "RequesterName",
                table: "MobileOrders");

            migrationBuilder.DropColumn(
                name: "RequesterUsername",
                table: "MobileOrders");

            migrationBuilder.AddColumn<int>(
                name: "DeviceCount",
                table: "MobileOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MobileOrderId",
                table: "MobileDevices",
                type: "int",
                nullable: true);

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
    }
}
