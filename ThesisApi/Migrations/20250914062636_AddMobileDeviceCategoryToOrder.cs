using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class AddMobileDeviceCategoryToOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeviceType",
                table: "MobileOrders");

            migrationBuilder.AddColumn<int>(
                name: "MobileDeviceCategoryId",
                table: "MobileOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MobileOrders_MobileDeviceCategoryId",
                table: "MobileOrders",
                column: "MobileDeviceCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_MobileOrders_MobileDeviceCategories_MobileDeviceCategoryId",
                table: "MobileOrders",
                column: "MobileDeviceCategoryId",
                principalTable: "MobileDeviceCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MobileOrders_MobileDeviceCategories_MobileDeviceCategoryId",
                table: "MobileOrders");

            migrationBuilder.DropIndex(
                name: "IX_MobileOrders_MobileDeviceCategoryId",
                table: "MobileOrders");

            migrationBuilder.DropColumn(
                name: "MobileDeviceCategoryId",
                table: "MobileOrders");

            migrationBuilder.AddColumn<string>(
                name: "DeviceType",
                table: "MobileOrders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
