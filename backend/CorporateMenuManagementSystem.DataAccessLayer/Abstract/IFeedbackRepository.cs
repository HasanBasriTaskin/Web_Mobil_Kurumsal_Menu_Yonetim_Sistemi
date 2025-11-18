using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.DataAccessLayer.Abstract
{
    public interface IFeedbackRepository : IGenericRepository<Feedback>
    {
        Task<List<Feedback>> GetAllFeedbacksWithRelationsAsync();

    }
}
