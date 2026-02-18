namespace RecipeBackend.Models;

public class UserDiet
{
    public int Id { get; set; } 
    public required int UserId { get; set; } 
    public required int DietId { get; set; } 
}