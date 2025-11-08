using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class AddMobileOrderApprover : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MobileOrders_Users_CustomerId",
                table: "MobileOrders");

            migrationBuilder.AddColumn<int>(
                name: "ApproverId",
                table: "MobileOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "MobileOrders",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MobileOrders_ApproverId",
                table: "MobileOrders",
                column: "ApproverId");

            migrationBuilder.CreateIndex(
                name: "IX_MobileOrders_UserId",
                table: "MobileOrders",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MobileOrders_Users_ApproverId",
                table: "MobileOrders",
                column: "ApproverId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MobileOrders_Users_CustomerId",
                table: "MobileOrders",
                column: "CustomerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MobileOrders_Users_UserId",
                table: "MobileOrders",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MobileOrders_Users_ApproverId",
                table: "MobileOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_MobileOrders_Users_CustomerId",
                table: "MobileOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_MobileOrders_Users_UserId",
                table: "MobileOrders");

            migrationBuilder.DropIndex(
                name: "IX_MobileOrders_ApproverId",
                table: "MobileOrders");

            migrationBuilder.DropIndex(
                name: "IX_MobileOrders_UserId",
                table: "MobileOrders");

            migrationBuilder.DropColumn(
                name: "ApproverId",
                table: "MobileOrders");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "MobileOrders");

            migrationBuilder.AddForeignKey(
                name: "FK_MobileOrders_Users_CustomerId",
                table: "MobileOrders",
                column: "CustomerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
