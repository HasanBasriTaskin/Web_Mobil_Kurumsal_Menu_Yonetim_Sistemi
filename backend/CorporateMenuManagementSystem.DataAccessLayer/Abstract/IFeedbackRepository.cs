using CorporateMenuManagementSystem.EntityLayer.Entitites;

namespace CorporateMenuManagementSystem.DataAccessLayer.Abstract
{
    public interface IFeedbackRepository : IGenericRepository<Feedback>
    {
        Task<List<Feedback>> GetAllFeedbacksWithRelationsAsync();

    }
}
