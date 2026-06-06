using System.Security.Cryptography;
using System.Text;

namespace ThesisApi.Helpers
{
    public static class LogAnonymizer
    {
        public const string UserPseudonymItemKey = "UserPseudonym";
        public const string UserDisplayMaskedItemKey = "UserDisplayMasked";
        public const string ClientIpMaskedItemKey = "ClientIpMasked";

        public static string Pseudonymize(string? input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return "anon";
            }

            var hash = SHA256.HashData(Encoding.UTF8.GetBytes(input.Trim().ToLowerInvariant()));
            return Convert.ToHexString(hash)[..12];
        }

        public static string MaskDisplayName(string? displayName)
        {
            if (string.IsNullOrWhiteSpace(displayName))
            {
                return "anonymous";
            }

            var value = displayName.Trim();
            if (value.Length == 1)
            {
                return "*";
            }

            if (value.Length == 2)
            {
                return $"{value[0]}*";
            }

            return $"{value[0]}***{value[^1]}";
        }

        public static string MaskIp(string? ipAddress)
        {
            if (string.IsNullOrWhiteSpace(ipAddress))
            {
                return "unknown";
            }

            var value = ipAddress.Trim();
            if (value.Contains('.'))
            {
                var parts = value.Split('.', StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length == 4)
                {
                    return $"{parts[0]}.{parts[1]}.x.x";
                }
            }

            if (value.Contains(':'))
            {
                var parts = value.Split(':', StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length > 0)
                {
                    return $"{parts[0]}:{(parts.Length > 1 ? parts[1] : "xxxx")}:****";
                }
            }

            return "masked";
        }
    }
}
