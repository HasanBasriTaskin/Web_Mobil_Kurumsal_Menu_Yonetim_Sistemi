namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Responses
{
    public class ErrorDetail
    {
        public ErrorDetail() { }

        public string? Code { get; set; }
        public string Message { get; set; } = null!;
        public string? Field { get; set; }

        public ErrorDetail(string field, string message, string? code = null)
        {
            Field = field;
            Message = message;
            Code = code;
        }
    }
}
