using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using Microsoft.EntityFrameworkCore;
using System;

namespace CorporateMenuManagementSystem.Tests.TestUtilities
{
    public static class TestDbContextHelper
    {
        public static MenuContext CreateInMemoryContext(string dbName = null)
        {
            var options = new DbContextOptionsBuilder<MenuContext>()
                .UseInMemoryDatabase(databaseName: dbName ?? Guid.NewGuid().ToString())
                .Options;

            var context = new MenuContext(options);
            context.Database.EnsureCreated();
            return context;
        }

        public static void SeedTestData(MenuContext context)
        {
            // Seed test data if needed
        }

        public static void Cleanup(MenuContext context)
        {
            context.Database.EnsureDeleted();
            context.Dispose();
        }
    }
}

