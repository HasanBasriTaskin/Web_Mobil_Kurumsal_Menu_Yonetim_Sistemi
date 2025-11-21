using Bogus;
using CorporateMenuManagementSystem.EntityLayer.Entitites;

namespace CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder.DataSeeder.Fakers
{
    public class MenuFaker : Faker<Menu>
    {
        public MenuFaker(int dayOffset)
        {
            var soups = new[] { "Mercimek Çorbası", "Ezogelin Çorbası", "Yayla Çorbası", "Domates Çorbası", "Tarhana Çorbası" };
            var mainCourses = new[] { "Tavuk Sote", "Karnıyarık", "Izgara Köfte", "Orman Kebabı", "Pirinç Pilavı ve Kuru Fasulye" };
            var sideDishes = new[] { "Bulgur Pilavı", "Mevsim Salata", "Cacık", "Havuç Tarator", "Gavurdağı Salatası" };
            var desserts = new[] { "Sütlaç", "Kazandibi", "Meyve Tabağı", "İrmik Helvası", "Revani" };

            RuleFor(m => m.MenuDate, f => DateTime.Now.Date.AddDays(dayOffset));
            RuleFor(m => m.Soup, f => f.PickRandom(soups));
            RuleFor(m => m.MainCourse, f => f.PickRandom(mainCourses));
            RuleFor(m => m.SideDish, f => f.PickRandom(sideDishes));
            RuleFor(m => m.Dessert, f => f.PickRandom(desserts));
            RuleFor(m => m.Calories, f => f.Random.Int(800, 1500));
        }
    }
}
