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
using CorporateMenuManagementSystem.API.Mappings;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder.DataSeeder;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
});

// DbContext ve Identity Yapılandırması
builder.Services.AddDbContext<MenuContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"), new MySqlServerVersion(new Version(8, 0, 26))));

builder.Services.AddIdentity<AppUser, AppRole>()
    .AddEntityFrameworkStores<MenuContext>()
    .AddDefaultTokenProviders();

// Dependency Injection Yapılandırması
builder.Services.AddScoped<IAuthService, AuthManager>();
builder.Services.AddScoped<ITokenService, TokenManager>();
builder.Services.AddScoped<IMenuRepository, MenuRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>();
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IAppUserRepository, AppUserRepository>();


builder.Services.AddScoped<IMenuService, MenuManager>();
builder.Services.AddScoped<INotificationService, NotificationManager>();
builder.Services.AddScoped<IFeedbackService, FeedbackManager>();
builder.Services.AddScoped<IReservationService, ReservationManager>();
builder.Services.AddScoped<IProfileService, ProfileManager>();


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


// CORS ayarları
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// Swagger'a JWT Bearer Authentication Desteği Ekleme
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Corporate Menu API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. <br /> 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      <br /> Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});


var app = builder.Build();

// Veritabanı Hazırlama ve Veri Tohumlama
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<MenuContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    var configuration = services.GetRequiredService<IConfiguration>();

    await context.Database.MigrateAsync();
    await SeedData.Initialize(services, userManager, roleManager, configuration);

    // Sadece Geliştirme Ortamında ve ayar aktif ise sahte veri bas
    if (app.Environment.IsDevelopment() && configuration.GetValue<bool>("DataFakerSettings:IsEnabled"))
    {
        await DataGenerator.SeedAsync(context, userManager, configuration);
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS middleware'i Authentication'dan ÖNCE olmalı
app.UseCors("AllowFrontend");

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();
