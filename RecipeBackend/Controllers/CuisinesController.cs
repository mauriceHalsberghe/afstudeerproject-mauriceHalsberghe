using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using RecipeBackend.Data;
using RecipeBackend.Models;
using System.Security.Claims;

namespace RecipeBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CuisinesController : ControllerBase
{
    private readonly ApiDbContext _context;

    public CuisinesController(ApiDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cuisine>>> GetCuisines()
    {
        return await _context.Cuisines.ToListAsync();
    }
}