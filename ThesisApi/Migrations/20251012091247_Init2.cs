using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ThesisApi.Migrations
{
    /// <inheritdoc />
    public partial class Init2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    MobileDeviceId = table.Column<int>(type: "int", nullable: true),
                    SimCardId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
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
                        name: "FK_MobileOrders_Users_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "User" },
                    { 2, "Admin" }
                });

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
                name: "MobileOrders");

            migrationBuilder.DropTable(
                name: "UserUserRole");

            migrationBuilder.DropTable(
                name: "MobileDevices");

            migrationBuilder.DropTable(
                name: "UserRoles");

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
