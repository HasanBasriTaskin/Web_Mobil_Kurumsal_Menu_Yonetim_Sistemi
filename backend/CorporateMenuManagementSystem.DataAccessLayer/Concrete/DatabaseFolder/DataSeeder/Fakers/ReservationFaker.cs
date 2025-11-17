using Bogus;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using CorporateMenuManagementSystem.EntityLayer.Enums;
using System.Collections.Generic;
using System.Linq;

namespace CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder.DataSeeder.Fakers
{
    public class ReservationFaker : Faker<Reservation>
    {
        public ReservationFaker(List<AppUser> users, List<Menu> menus)
        {
            RuleFor(r => r.AppUserId, f => f.PickRandom(users).Id);
            RuleFor(r => r.MenuId, f => f.PickRandom(menus).Id);
            RuleFor(r => r.ReservationStatus, f => f.PickRandom<ReservationStatus>());
            RuleFor(r => r.CreatedDate, (f, reservation) =>
            {
                var menu = menus.First(m => m.Id == reservation.MenuId);
                return menu.MenuDate.AddHours(-f.Random.Double(24, 72));
            });
        }
    }
}
