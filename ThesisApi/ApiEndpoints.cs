namespace ThesisApi
{
    public static class ApiEndpoints
    {
        private const string ApiBase = "/api";

        public class Users
        {
            private const string Base = $"{ApiBase}/users";
            public const string Login = $"{Base}/login";
        }

        public class SimCards
        {
            private const string Base = $"{ApiBase}/sim-cards";

            public const string GetAll = Base;

            public const string Create = Base;

            public const string Get = $"{Base}/{{id:int}}";
            public const string Update = $"{Base}/{{id:int}}";

            public const string Delete = $"{Base}/{{id:int}}";
        }

        public class MobileOrders
        {
            private const string Base = $"{ApiBase}/mobile-orders";

            public const string GetAll = Base;

            public const string Create = Base;

            public const string Get = $"{Base}/{{id:int}}";

            public const string Delete = $"{Base}/{{id:int}}";

        }

        public class MobileDevices
        {
            private const string Base = $"{ApiBase}/mobile-devices";

            public const string GetAll = Base;

            public const string Create = Base;

            public const string Get = $"{Base}/{{id:int}}";

            public const string Delete = $"{Base}/{{id:int}}";
            public const string GetAllMobileDeviceCategories = $"{Base}/categories";
        }

        public class Admin
        {
            private const string Base = $"{ApiBase}/admin";
            private const string MobileDeviceCategoryBase = $"{Base}/mobile-device-categories";
            public const string GetAllMobileDeviceCategories = MobileDeviceCategoryBase;
            public const string GetMobileDeviceCategoryById = $"{MobileDeviceCategoryBase}/{{id:int}}";
            public const string CreateMobileDeviceCategory = MobileDeviceCategoryBase;
            public const string UpdateMobileDeviceCategory = $"{MobileDeviceCategoryBase}/{{id:int}}";
            public const string DeleteMobileDeviceCategory = $"{MobileDeviceCategoryBase}/{{id:int}}";


        }
    }
}