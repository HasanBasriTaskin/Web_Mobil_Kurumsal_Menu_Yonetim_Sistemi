using FluentValidation;
using backend.DTOs;

namespace backend.Validators;

// Example FluentValidation validator
public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email gereklidir")
            .EmailAddress().WithMessage("Geçerli bir email adresi giriniz");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Şifre gereklidir")
            .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır");
    }
}
