using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Admin;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Concrete
{
    public class AdminDashboardManager : IAdminDashboardService
    {
        private readonly IMenuRepository _menuRepository;
        private readonly IReservationRepository _reservationRepository;
        private readonly IFeedbackRepository _feedbackRepository;
        private readonly ISurveyRepository _surveyRepository;

        public AdminDashboardManager(
            IMenuRepository menuRepository,
            IReservationRepository reservationRepository,
            IFeedbackRepository feedbackRepository,
            ISurveyRepository surveyRepository)
        {
            _menuRepository = menuRepository;
            _reservationRepository = reservationRepository;
            _feedbackRepository = feedbackRepository;
            _surveyRepository = surveyRepository;
        }

        public async Task<Response<AdminDashboardSummaryDto>> GetDashboardSummaryAsync()
        {
            try
            {
                var today = DateTime.Today;

                // Get reservation counts
                var todayReservationCount = await _reservationRepository.GetTotalReservationsCountByDateAsync(today);
                var tomorrowReservationCount = await _reservationRepository.GetTotalReservationsCountByDateAsync(today.AddDays(1));

                // Calculate this week's reservation count
                var currentWeekStart = GetMonday(today);
                var currentWeekEnd = currentWeekStart.AddDays(6);
                var thisWeekReservations = await _reservationRepository.GetListByFilterAsync(r =>
                    r.Menu.MenuDate >= currentWeekStart && r.Menu.MenuDate <= currentWeekEnd);

                // Get menu statistics
                var allMenus = await _menuRepository.GetAllAsync();
                var totalMenus = allMenus.Count;
                var activeMenus = allMenus.Count(m => m.MenuDate >= today);

                // Get feedback statistics
                var allFeedbacks = await _feedbackRepository.GetAllAsync();
                var totalFeedbacks = allFeedbacks.Count;
                var averageRating = allFeedbacks.Any() ? allFeedbacks.Average(f => (double)f.Star) : 0;

                // Get active survey count
                var activeSurvey = await _surveyRepository.GetActiveSurveyAsync();
                var activeSurveyCount = activeSurvey != null ? 1 : 0;

                var summary = new AdminDashboardSummaryDto
                {
                    Reservations = new ReservationSummaryDto
                    {
                        Today = todayReservationCount,
                        Tomorrow = tomorrowReservationCount,
                        ThisWeek = thisWeekReservations.Count
                    },
                    Menus = new MenuSummaryDto
                    {
                        Total = totalMenus,
                        Active = activeMenus
                    },
                    Feedback = new FeedbackSummaryStatsDto
                    {
                        Total = totalFeedbacks,
                        AverageRating = Math.Round(averageRating, 1)
                    },
                    Surveys = new SurveySummaryDto
                    {
                        ActiveCount = activeSurveyCount
                    }
                };

                return Response<AdminDashboardSummaryDto>.Success(summary, 200);
            }
            catch (Exception ex)
            {
                return Response<AdminDashboardSummaryDto>.Fail(
                    new ErrorDetail("DashboardError", $"Dashboard özeti yüklenirken hata oluştu: {ex.Message}"), 500);
            }
        }

        private DateTime GetMonday(DateTime date)
        {
            var dayOfWeek = date.DayOfWeek;
            var daysFromMonday = dayOfWeek == DayOfWeek.Sunday ? 6 : (int)dayOfWeek - 1;
            return date.AddDays(-daysFromMonday).Date;
        }
    }
}

