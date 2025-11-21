using Bogus;
using CorporateMenuManagementSystem.EntityLayer.Entitites;

namespace CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder.DataSeeder.Fakers
{
    public class FeedbackFaker : Faker<Feedback>
    {
        public FeedbackFaker(List<AppUser> users, List<Menu> menus)
        {
            var random = new Bogus.Randomizer();

            RuleFor(f => f.AppUserId, f => f.PickRandom(users).Id);
            RuleFor(f => f.MenuId, f => f.PickRandom(menus).Id);
            RuleFor(f => f.Star, f => (byte)f.Random.Number(3, 5));
            RuleFor(f => f.Comment, f => f.Lorem.Sentence(10, 5));
            RuleFor(f => f.CreatedDate, (f, feedback) =>
            {
                var menu = menus.First(m => m.Id == feedback.MenuId);
                return menu.MenuDate.AddHours(f.Random.Double(5, 10));
            });
        }
    }
}
