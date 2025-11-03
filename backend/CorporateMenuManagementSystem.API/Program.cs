using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// DbContext ve Identity Yapılandırması
builder.Services.AddDbContext<MenuContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 21))));

builder.Services.AddIdentity<AppUser, AppRole>()
    .AddEntityFrameworkStores<MenuContext>();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Veritabanı ve Başlangıç Verilerini Hazırlama
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var loggerFactory = services.GetRequiredService<ILoggerFactory>();
    try
    {
        var context = services.GetRequiredService<MenuContext>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
        var configuration = services.GetRequiredService<IConfiguration>();
        
        // Bekleyen migration'ları uygula veya veritabanını oluştur
        await context.Database.MigrateAsync();
        
        // Başlangıç verilerini (roller ve admin) ekle
        await SeedData.Initialize(services, userManager, roleManager, configuration);
    }
    catch (Exception ex)
    {
        var logger = loggerFactory.CreateLogger<Program>();
        logger.LogError(ex, "Uygulama başlangıcında bir hata oluştu.");
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
