using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using RecipeBackend.Data;
using RecipeBackend.Models;
using System.Security.Claims;

namespace RecipeBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListIngredientsController : ControllerBase
{
    private readonly ApiDbContext _context;

    public ListIngredientsController(ApiDbContext context)
    {
        _context = context;
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<ListIngredient>>> GetUserList(int userId)
    {
        var userList = await _context.ListIngredients
            .Where(i => i.UserId == userId)
            .Include(i => i.Ingredient)
            .Include(i => i.QuantityUnit)
            .ToListAsync();

        if (!userList.Any())
        {
            return NotFound($"No List found for user {userId}");
        }

        return Ok(userList);
    }
}