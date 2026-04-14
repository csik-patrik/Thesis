using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateTable(
                name: "SimCallControlGroups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDataEnabled = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SimCallControlGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CostCenter = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SimCards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SimCallControlGroupId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SimCards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SimCards_SimCallControlGroups_SimCallControlGroupId",
                        column: x => x.SimCallControlGroupId,
                        principalTable: "SimCallControlGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Computers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Hostname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ComputerCategoryId = table.Column<int>(type: "int", nullable: false),
                    Model = table.Column<string>(type: "nvarchar(max)", nullable: false),
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

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserUserRole",
                columns: table => new
                {
                    UserRolesId = table.Column<int>(type: "int", nullable: false),
                    UsersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserUserRole", x => new { x.UserRolesId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_UserUserRole_UserRoles_UserRolesId",
                        column: x => x.UserRolesId,
                        principalTable: "UserRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserUserRole_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MobileDevices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Hostname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MobileDeviceCategoryId = table.Column<int>(type: "int", nullable: false),
                    ImeiNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SerialNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    SimCardId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatusReason = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MobileDevices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MobileDevices_MobileDeviceCategories_MobileDeviceCategoryId",
                        column: x => x.MobileDeviceCategoryId,
                        principalTable: "MobileDeviceCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MobileDevices_SimCards_SimCardId",
                        column: x => x.SimCardId,
                        principalTable: "SimCards",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MobileDevices_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ComputerOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    ComputerCategoryId = table.Column<int>(type: "int", nullable: false),
                    PickupLocation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApproverId = table.Column<int>(type: "int", nullable: false),
                    ComputerId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComputerOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ComputerOrders_ComputerCategories_ComputerCategoryId",
                        column: x => x.ComputerCategoryId,
                        principalTable: "ComputerCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ComputerOrders_Computers_ComputerId",
                        column: x => x.ComputerId,
                        principalTable: "Computers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ComputerOrders_Users_ApproverId",
                        column: x => x.ApproverId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ComputerOrders_Users_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MobileOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    MobileDeviceCategoryId = table.Column<int>(type: "int", nullable: false),
                    SimCallControlGroupId = table.Column<int>(type: "int", nullable: false),
                    PickupLocation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApproverId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MobileDeviceId = table.Column<int>(type: "int", nullable: true),
                    SimCardId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MobileOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MobileOrders_MobileDeviceCategories_MobileDeviceCategoryId",
                        column: x => x.MobileDeviceCategoryId,
                        principalTable: "MobileDeviceCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MobileOrders_MobileDevices_MobileDeviceId",
                        column: x => x.MobileDeviceId,
                        principalTable: "MobileDevices",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MobileOrders_SimCallControlGroups_SimCallControlGroupId",
                        column: x => x.SimCallControlGroupId,
                        principalTable: "SimCallControlGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MobileOrders_SimCards_SimCardId",
                        column: x => x.SimCardId,
                        principalTable: "SimCards",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MobileOrders_Users_ApproverId",
                        column: x => x.ApproverId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MobileOrders_Users_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MobileOrders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "ComputerCategories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Standard" },
                    { 2, "Enhanced" },
                    { 3, "Professional" }
                });

            migrationBuilder.InsertData(
                table: "MobileDeviceCategories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Feature phone" },
                    { 2, "Standard smartphone" },
                    { 3, "Enhanced smartphone" }
                });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "User" },
                    { 2, "Admin" },
                    { 3, "Group leader" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CostCenter", "Department", "DisplayName", "Email", "Password", "Username" },
                values: new object[,]
                {
                    { 1, "000001", "Demo department", "Demo User1", "demo.user1@demo.com", "AQAAAAIAAYagAAAAECz6RUU/Xc9H9QwB0DJhf5kXqwWVw9wEhlgR48pNE28mp+5wY+qzLqoYsH2mW2oYxQ==", "user1" },
                    { 2, "000001", "Demo department", "Demo User2", "demo.user2@demo.com", "AQAAAAIAAYagAAAAEKQyl5xwymUK928U9RYrzGZs1VZADbwFhh8WawPXDpFJ+hXUfkEbThjZPYFmtFjiVg==", "user2" },
                    { 3, "000001", "Demo department", "Demo User3", "demo.user3@demo.com", "AQAAAAIAAYagAAAAEGWIGMJ2/ljmbfUjrxGwYS5j2f+BjcWZRY4Fl6zEqGUsaCxUdRsNK4c6+o0lZJvIcA==", "user3" }
                });

            migrationBuilder.InsertData(
                table: "UserUserRole",
                columns: new[] { "UserRolesId", "UsersId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 2 },
                    { 3, 3 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ComputerOrders_ApproverId",
                table: "ComputerOrders",
                column: "ApproverId");

            migrationBuilder.CreateIndex(
                name: "IX_ComputerOrders_ComputerCategoryId",
                table: "ComputerOrders",
                column: "ComputerCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ComputerOrders_ComputerId",
                table: "ComputerOrders",
                column: "ComputerId");

            migrationBuilder.CreateIndex(
                name: "IX_ComputerOrders_CustomerId",
                table: "ComputerOrders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Computers_ComputerCategoryId",
                table: "Computers",
                column: "ComputerCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Computers_UserId",
                table: "Computers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MobileDevices_MobileDeviceCategoryId",
                table: "MobileDevices",
                column: "MobileDeviceCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_MobileDevices_SimCardId",
                table: "MobileDevices",
                column: "SimCardId",
                unique: true,
                filter: "[SimCardId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_MobileDevices_UserId",
                table: "MobileDevices",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MobileOrders_ApproverId",
                table: "MobileOrders",
                column: "ApproverId");

            migrationBuilder.CreateIndex(
                name: "IX_MobileOrders_CustomerId",
                table: "MobileOrders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_MobileOrders_MobileDeviceCategoryId",
                table: "MobileOrders",
                column: "MobileDeviceCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_MobileOrders_MobileDeviceId",
                table: "MobileOrders",
                column: "MobileDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_MobileOrders_SimCallControlGroupId",
                table: "MobileOrders",
                column: "SimCallControlGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_MobileOrders_SimCardId",
                table: "MobileOrders",
                column: "SimCardId");

            migrationBuilder.CreateIndex(
                name: "IX_MobileOrders_UserId",
                table: "MobileOrders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SimCards_SimCallControlGroupId",
                table: "SimCards",
                column: "SimCallControlGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_UserUserRole_UsersId",
                table: "UserUserRole",
                column: "UsersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ComputerOrders");

            migrationBuilder.DropTable(
                name: "MobileOrders");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "UserUserRole");

            migrationBuilder.DropTable(
                name: "Computers");

            migrationBuilder.DropTable(
                name: "MobileDevices");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "ComputerCategories");

            migrationBuilder.DropTable(
                name: "MobileDeviceCategories");

            migrationBuilder.DropTable(
                name: "SimCards");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "SimCallControlGroups");
        }
    }
}
