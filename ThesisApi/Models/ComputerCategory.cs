namespace ThesisApi.Models
{
    public class ComputerCategory
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        public ICollection<Computer> Computers { get; set; } = new List<Computer>();
    }
}