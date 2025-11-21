namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Responses
{
    public class Response<T>
    {
        public bool IsSuccessful { get; private set; }
        public int StatusCode { get; private set; }
        public T? Data { get; set; }
        public List<ErrorDetail>? Errors { get; private set; }

        protected Response() { }

        public static Response<T> Success(T data, int statusCode = 200) => new()
        {
            IsSuccessful = true,
            StatusCode = statusCode,
            Data = data,
            Errors = null
        };

        public static Response<T> Fail(List<ErrorDetail> errors, int statusCode = 400) => new()
        {
            IsSuccessful = false,
            StatusCode = statusCode,
            Data = default,
            Errors = errors
        };
        public static Response<T> Fail(ErrorDetail error, int statusCode = 400) => new()
        {
            IsSuccessful = false,
            StatusCode = statusCode,
            Data = default,
            Errors = new List<ErrorDetail> { error }
        };
    }
}
