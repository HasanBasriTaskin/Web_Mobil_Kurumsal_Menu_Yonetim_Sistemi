using AutoMapper;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Survey;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
<<<<<<< HEAD
using System;
using System.Threading.Tasks;
=======
>>>>>>> d7d78a2819fd570a883059cf4c75608d05be4400

namespace CorporateMenuManagementSystem.BusinessLayer.Concrete
{
    public class AdminSurveyManager : IAdminSurveyService
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly ISurveyResponseRepository _surveyResponseRepository;
        private readonly IMapper _mapper;

        public AdminSurveyManager(ISurveyRepository surveyRepository, ISurveyResponseRepository surveyResponseRepository, IMapper mapper)
        {
            _surveyRepository = surveyRepository;
            _surveyResponseRepository = surveyResponseRepository;
            _mapper = mapper;
        }

        public async Task<Response<SurveyDto>> CreateSurveyAsync(CreateSurveyDto createSurveyDto)
        {
            // Mevcut aktif anketi pasif yap
            var activeSurvey = await _surveyRepository.GetActiveSurveyAsync();
            if (activeSurvey != null)
            {
                activeSurvey.IsActive = false;
                await _surveyRepository.UpdateAsync(activeSurvey);
            }

            // Yeni anket oluştur
            var newSurvey = _mapper.Map<Survey>(createSurveyDto);
            newSurvey.IsActive = true;
            newSurvey.CreatedDate = DateTime.UtcNow;

            await _surveyRepository.AddAsync(newSurvey);

            var surveyDto = _mapper.Map<SurveyDto>(newSurvey);
            return Response<SurveyDto>.Success(surveyDto, 201);
        }

        public async Task<Response<SurveyResultDto>> GetSurveyResultsAsync(int surveyId)
        {
            var survey = await _surveyRepository.GetByIdAsync(surveyId);
            if (survey == null)
            {
                return Response<SurveyResultDto>.Fail(new ErrorDetail("SurveyId", "Anket bulunamadı."), 404);
            }

            var yesCount = await _surveyResponseRepository.GetYesCountAsync(surveyId);
            var noCount = await _surveyResponseRepository.GetNoCountAsync(surveyId);
            var totalCount = yesCount + noCount;

            var surveyResult = new SurveyResultDto
            {
                SurveyId = survey.Id,
                Title = survey.Title,
                Question = survey.Question,
                YesCount = yesCount,
                NoCount = noCount,
                TotalResponses = totalCount,
                YesPercentage = totalCount > 0 ? Math.Round((double)yesCount / totalCount * 100, 2) : 0,
                NoPercentage = totalCount > 0 ? Math.Round((double)noCount / totalCount * 100, 2) : 0,
                CreatedDate = survey.CreatedDate,
                EndDate = survey.EndDate,
                IsActive = survey.IsActive
            };

            return Response<SurveyResultDto>.Success(surveyResult, 200);
        }

        public async Task<Response<NoContentDto>> UpdateSurveyStatusAsync(int surveyId, bool isActive)
        {
            var survey = await _surveyRepository.GetByIdAsync(surveyId);
            if (survey == null)
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("SurveyId", "Anket bulunamadı."), 404);
            }

            survey.IsActive = isActive;
            await _surveyRepository.UpdateAsync(survey);

            return Response<NoContentDto>.Success(null, 200);
        }
    }
}
