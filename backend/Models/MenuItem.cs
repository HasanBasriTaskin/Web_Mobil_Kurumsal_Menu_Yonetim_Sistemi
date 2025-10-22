namespace backend.Models;

// Example domain model
// This represents a table in the database
public class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
}

// Example entity
public class MenuItem : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public string? ImageUrl { get; set; }
}
