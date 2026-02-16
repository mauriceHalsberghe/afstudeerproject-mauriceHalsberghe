using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeBackend.Data;
using RecipeBackend.Models;

namespace RecipeBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StepsController : ControllerBase
{
    private readonly ApiDbContext _context;

    public StepsController(ApiDbContext context)
    {
        _context = context;
    }

    [HttpGet("recipe/{recipeId}")]
    public async Task<ActionResult<IEnumerable<Step>>> GetSteps(int recipeId)
    {
        return await _context.Steps
            .Where(s => s.RecipeId == recipeId)
            .OrderBy(s => s.StepNumber)
            .ToListAsync();
    }
}
