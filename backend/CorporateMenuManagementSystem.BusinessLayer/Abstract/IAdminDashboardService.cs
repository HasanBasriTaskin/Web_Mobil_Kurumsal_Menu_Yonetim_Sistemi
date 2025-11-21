using CorporateMenuManagementSystem.EntityLayer.DTOs.Admin;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IAdminDashboardService
    {
        Task<Response<AdminDashboardSummaryDto>> GetDashboardSummaryAsync();
    }
}

