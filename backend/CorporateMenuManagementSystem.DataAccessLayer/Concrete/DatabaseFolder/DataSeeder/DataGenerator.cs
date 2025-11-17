using Bogus;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder.DataSeeder.Fakers;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder.DataSeeder
{
    public static class DataGenerator
    {
        public static async Task SeedAsync(MenuContext context, UserManager<AppUser> userManager, IConfiguration configuration)
        {
            var userCount = configuration.GetValue<int>("DataFakerSettings:UserCount");
            var menuDays = configuration.GetValue<int>("DataFakerSettings:MenuDays");
            var defaultPassword = configuration["DataFakerSettings:DefaultPassword"];

            // 1. Kullanıcıları Üret ve Kaydet
            if (!await userManager.Users.AnyAsync(u => u.UserName != "admin"))
            {
                var userFaker = new AppUserFaker();
                var fakeUsers = userFaker.Generate(userCount);

                foreach (var user in fakeUsers)
                {
                    if (await userManager.CreateAsync(user, defaultPassword) == IdentityResult.Success)
                    {
                        await userManager.AddToRoleAsync(user, "User");
                    }
                }
            }

            // 2. Menüleri Üret ve Kaydet
            if (!await context.Menus.AnyAsync())
            {
                // Hem geçmiş hem de gelecek için menü üret
                for (int i = -(menuDays / 2); i < (menuDays / 2); i++)
                {
                    var menuFaker = new MenuFaker(i);
                    var fakeMenu = menuFaker.Generate();
                    await context.Menus.AddAsync(fakeMenu);
                }
                await context.SaveChangesAsync();
            }

            var users = await userManager.Users.Where(u => u.UserName != "admin").ToListAsync();
            var menus = await context.Menus.ToListAsync();
            
            if (!users.Any() || !menus.Any()) return;

            // 3. Rezervasyonları Üret
            if (!await context.Reservations.AnyAsync())
            {
                var reservationFaker = new ReservationFaker(users, menus);
                var fakeReservations = reservationFaker.Generate(users.Count * menuDays / 2); // Ortalama sayıda rezervasyon
                
                // Yinelenen kayıtları engelle
                var distinctReservations = fakeReservations
                    .GroupBy(r => new { r.AppUserId, r.MenuId })
                    .Select(g => g.First());

                await context.Reservations.AddRangeAsync(distinctReservations);
                await context.SaveChangesAsync();
            }
            
            // 4. Geri Bildirimleri Üret
            if (!await context.Feedbacks.AnyAsync())
            {
                var pastMenus = menus.Where(m => m.MenuDate.Date < System.DateTime.Now.Date).ToList();
                if(pastMenus.Any())
                {
                    var feedbackFaker = new FeedbackFaker(users, pastMenus);
                    var fakeFeedbacks = feedbackFaker.Generate(users.Count * pastMenus.Count / 4); // Daha az sayıda feedback

                    var distinctFeedbacks = fakeFeedbacks
                        .GroupBy(f => new { f.AppUserId, f.MenuId })
                        .Select(g => g.First());
                    
                    await context.Feedbacks.AddRangeAsync(distinctFeedbacks);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
