using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.BusinessLayer.Concrete;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.Repositories;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// DbContext ve Identity Yapılandırması
builder.Services.AddDbContext<MenuContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 21))));

builder.Services.AddIdentity<AppUser, AppRole>()
    .AddEntityFrameworkStores<MenuContext>();

// Dependency Injection Yapılandırması
builder.Services.AddScoped<IAuthService, AuthManager>();
builder.Services.AddScoped<ITokenService, TokenManager>();
builder.Services.AddScoped<IMenuRepository, MenuRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>();
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();


builder.Services.AddScoped<IMenuService, MenuManager>();
builder.Services.AddScoped<INotificationService, NotificationManager>();
builder.Services.AddScoped<IFeedbackService, FeedbackManager>();
builder.Services.AddScoped<IReservationService, ReservationManager>();


// JWT Authentication Yapılandırması
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"]))
    };
});


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

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();
