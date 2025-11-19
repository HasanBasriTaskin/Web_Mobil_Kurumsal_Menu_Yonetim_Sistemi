using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Survey;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.API.Controllers
{
    [Route("api")]
    [ApiController]
    public class SurveyController : ControllerBase
    {
        private readonly ISurveyService _surveyService;

        public SurveyController(ISurveyService surveyService)
        {
            _surveyService = surveyService;
        }

        [HttpGet("survey/active")]
        [Authorize]
        public async Task<IActionResult> GetActiveSurvey()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _surveyService.GetActiveSurveyAsync(userId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("survey/respond")]
        [Authorize]
        public async Task<IActionResult> SubmitSurveyResponse([FromBody] SurveyResponseDto surveyResponseDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _surveyService.SubmitSurveyResponseAsync(surveyResponseDto, userId);
            return StatusCode(result.StatusCode, result);
        }
    }
}
