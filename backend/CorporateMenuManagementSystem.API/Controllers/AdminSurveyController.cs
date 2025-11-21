using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Survey;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CorporateMenuManagementSystem.API.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminSurveyController : ControllerBase
    {
        private readonly IAdminSurveyService _adminSurveyService;

        public AdminSurveyController(IAdminSurveyService adminSurveyService)
        {
            _adminSurveyService = adminSurveyService;
        }

        [HttpPost("survey")]
        public async Task<IActionResult> CreateSurvey([FromBody] CreateSurveyDto createSurveyDto)
        {
            var result = await _adminSurveyService.CreateSurveyAsync(createSurveyDto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("survey/{id}/results")]
        public async Task<IActionResult> GetSurveyResults(int id)
        {
            var result = await _adminSurveyService.GetSurveyResultsAsync(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("survey/{id}/status")]
        public async Task<IActionResult> UpdateSurveyStatus(int id, [FromBody] UpdateSurveyStatusDto updateStatusDto)
        {
            var result = await _adminSurveyService.UpdateSurveyStatusAsync(id, updateStatusDto.IsActive);
            return StatusCode(result.StatusCode, result);
        }
    }
}
