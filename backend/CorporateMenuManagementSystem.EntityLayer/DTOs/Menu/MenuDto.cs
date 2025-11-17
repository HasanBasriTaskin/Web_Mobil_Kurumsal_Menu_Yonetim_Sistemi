using System;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Menu
{
    public class MenuDto
    {
        public int Id { get; set; }
        public DateTime MenuDate { get; set; }
        public string Soup { get; set; }
        public string MainCourse { get; set; }
        public string SideDish { get; set; }
        public string Dessert { get; set; }
        public int Calories { get; set; }
    }
}
