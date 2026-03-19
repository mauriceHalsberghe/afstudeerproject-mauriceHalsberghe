using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using RecipeBackend.Data;
using RecipeBackend.Models;
using System.Security.Claims;

namespace RecipeBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DishTypesController : ControllerBase
{
    private readonly ApiDbContext _context;

    public DishTypesController(ApiDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DishType>>> GetDishTypes()
    {
        return await _context.DishTypes.ToListAsync();
    }
}