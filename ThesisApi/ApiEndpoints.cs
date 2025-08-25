using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ThesisApi
{
    public static class ApiEndpoints
    {
        private const string ApiBase = "/api";

        public class SimCards
        {
            private const string Base = $"{ApiBase}/sim-cards";

            public const string GetAll = Base;

            public const string Create = Base;

            public const string Get = $"{Base}/{{id:int}}";

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

        }
    }
}