using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IFeedbackService : IGenericService<Feedback>
    {
        Task<List<Feedback>> GetAllFeedbacksWithRelationsAsync();
        Task<Response<Feedback>> CreateFeedbackAsync(Feedback feedback);
    }
}
