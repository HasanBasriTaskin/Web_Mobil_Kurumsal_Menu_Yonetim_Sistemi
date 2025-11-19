using AutoMapper;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Survey;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Concrete
{
    public class SurveyManager : ISurveyService
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly ISurveyResponseRepository _surveyResponseRepository;
        private readonly IMapper _mapper;

        public SurveyManager(ISurveyRepository surveyRepository, ISurveyResponseRepository surveyResponseRepository, IMapper mapper)
        {
            _surveyRepository = surveyRepository;
            _surveyResponseRepository = surveyResponseRepository;
            _mapper = mapper;
        }

        public async Task<Response<SurveyDto>> GetActiveSurveyAsync(string userId)
        {
            var activeSurvey = await _surveyRepository.GetActiveSurveyAsync();
            
            if (activeSurvey == null)
            {
                return Response<SurveyDto>.Fail(new ErrorDetail("Survey", "Şu anda aktif bir anket bulunmamaktadır."), 404);
            }

            var surveyDto = _mapper.Map<SurveyDto>(activeSurvey);
            
            // Kullanıcının bu ankete cevap verip vermediğini kontrol et
            surveyDto.HasUserResponded = await _surveyRepository.HasUserRespondedAsync(activeSurvey.Id, userId);

            return Response<SurveyDto>.Success(surveyDto, 200);
        }

        public async Task<Response<NoContentDto>> SubmitSurveyResponseAsync(SurveyResponseDto surveyResponseDto, string userId)
        {
            // Anketin var olup olmadığını kontrol et
            var survey = await _surveyRepository.GetByIdAsync(surveyResponseDto.SurveyId);
            if (survey == null)
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("SurveyId", "Anket bulunamadı."), 404);
            }

            // Anketin aktif olup olmadığını kontrol et
            if (!survey.IsActive || (survey.EndDate.HasValue && survey.EndDate < DateTime.UtcNow))
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("Survey", "Bu anket artık aktif değil."), 400);
            }

            // Kullanıcının daha önce cevap verip vermediğini kontrol et
            var existingResponse = await _surveyResponseRepository.GetUserResponseAsync(surveyResponseDto.SurveyId, userId);
            if (existingResponse != null)
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("Survey", "Bu ankete zaten cevap verdiniz."), 409);
            }

            // Yeni cevabı kaydet
            var surveyResponse = new SurveyResponse
            {
                SurveyId = surveyResponseDto.SurveyId,
                AppUserId = userId,
                Answer = surveyResponseDto.Answer,
                CreatedDate = DateTime.UtcNow
            };

            await _surveyResponseRepository.AddAsync(surveyResponse);

            return Response<NoContentDto>.Success(null, 201);
        }
    }
}
