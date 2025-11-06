using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class AddComputerOrderApprover : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ComputerOrders_Users_CustomerId",
                table: "ComputerOrders");

            migrationBuilder.AddColumn<int>(
                name: "ApproverId",
                table: "ComputerOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ComputerOrders_ApproverId",
                table: "ComputerOrders",
                column: "ApproverId");

            migrationBuilder.AddForeignKey(
                name: "FK_ComputerOrders_Users_ApproverId",
                table: "ComputerOrders",
                column: "ApproverId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ComputerOrders_Users_CustomerId",
                table: "ComputerOrders",
                column: "CustomerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ComputerOrders_Users_ApproverId",
                table: "ComputerOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_ComputerOrders_Users_CustomerId",
                table: "ComputerOrders");

            migrationBuilder.DropIndex(
                name: "IX_ComputerOrders_ApproverId",
                table: "ComputerOrders");

            migrationBuilder.DropColumn(
                name: "ApproverId",
                table: "ComputerOrders");

            migrationBuilder.AddForeignKey(
                name: "FK_ComputerOrders_Users_CustomerId",
                table: "ComputerOrders",
                column: "CustomerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
