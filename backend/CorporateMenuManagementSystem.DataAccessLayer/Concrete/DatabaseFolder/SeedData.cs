using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, IConfiguration configuration)
        {
            // Rolleri Ekleme
            var roles = configuration.GetSection("DataSeedingSettings:Roles").Get<List<AppRole>>();
            if (roles != null)
            {
                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role.Name))
                    {
                        await roleManager.CreateAsync(new AppRole { Name = role.Name, Description = role.Description });
                    }
                }
            }

            // Admin Kullanıcısını Ekleme
            var adminUserConfig = configuration.GetSection("DataSeedingSettings:AdminUser");
            if (adminUserConfig.Exists())
            {
                var email = adminUserConfig["Email"];
                if (await userManager.FindByEmailAsync(email) == null)
                {
                    AppUser adminUser = new AppUser
                    {
                        FirstName = adminUserConfig["FirstName"],
                        LastName = adminUserConfig["LastName"],
                        UserName = adminUserConfig["UserName"],
                        Email = email,
                        EmailConfirmed = true
                    };

                    var result = await userManager.CreateAsync(adminUser, adminUserConfig["Password"]);

                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(adminUser, "Admin");
                    }
                }
            }
        }
    }
}


