namespace ThesisApi.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public required EventType EventType { get; set; }
        public required EntityName EntityName { get; set; }
        public required int EntityId { get; set; }
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public required string Username { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}