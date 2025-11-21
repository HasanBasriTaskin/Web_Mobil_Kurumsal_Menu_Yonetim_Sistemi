using CorporateMenuManagementSystem.EntityLayer.DTOs.Admin;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IAdminDashboardService
    {
        Task<Response<AdminDashboardSummaryDto>> GetDashboardSummaryAsync();
    }
}

