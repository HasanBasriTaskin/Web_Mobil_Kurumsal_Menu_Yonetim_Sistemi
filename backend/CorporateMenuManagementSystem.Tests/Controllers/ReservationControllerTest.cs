using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.API.Controllers;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Reservation;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Controllers
{
    public class ReservationControllerTest
    {
        private readonly Mock<IReservationService> _mockReservationService;
        private readonly ReservationController _reservationController;

        public ReservationControllerTest()
        {
            _mockReservationService = new Mock<IReservationService>();
            _reservationController = new ReservationController(_mockReservationService.Object);
            
            // Setup default user claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "user123")
            };
            var identity = new ClaimsIdentity(claims, "Test");
            var principal = new ClaimsPrincipal(identity);
            _reservationController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };
        }

        [Fact]
        public async Task GetMyReservations_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var response = Response<List<ReservationDto>>.Success(new List<ReservationDto>(), 200);
            _mockReservationService.Setup(s => s.GetReservationsByUserIdWithRelationsAsync(userId))
                .ReturnsAsync(response);

            // Act
            var result = await _reservationController.GetMyReservations() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task CreateReservation_WhenSuccessful_ShouldReturn201()
        {
            // Arrange
            var createReservationDto = new CreateReservationDto { MenuId = 1 };
            var userId = "user123";
            var response = Response<ReservationDto>.Success(new ReservationDto { Id = 1 }, 201);
            _mockReservationService.Setup(s => s.CreateReservationAsync(createReservationDto, userId))
                .ReturnsAsync(response);

            // Act
            var result = await _reservationController.CreateReservation(createReservationDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(201, result.StatusCode);
        }

        [Fact]
        public async Task CreateReservation_WhenFailed_ShouldReturnErrorStatusCode()
        {
            // Arrange
            var createReservationDto = new CreateReservationDto { MenuId = 1 };
            var userId = "user123";
            var response = Response<ReservationDto>.Fail(new ErrorDetail("Menu", "Menu not found"), 404);
            _mockReservationService.Setup(s => s.CreateReservationAsync(createReservationDto, userId))
                .ReturnsAsync(response);

            // Act
            var result = await _reservationController.CreateReservation(createReservationDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task CancelReservation_WhenSuccessful_ShouldReturn204()
        {
            // Arrange
            var reservationId = 1;
            var userId = "user123";
            var response = Response<NoContentDto>.Success(new NoContentDto(), 204);
            _mockReservationService.Setup(s => s.CancelReservationAsync(reservationId, userId))
                .ReturnsAsync(response);

            // Act
            var result = await _reservationController.CancelReservation(reservationId) as NoContentResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(204, result.StatusCode);
        }

        [Fact]
        public async Task CancelReservation_WhenFailed_ShouldReturnErrorStatusCode()
        {
            // Arrange
            var reservationId = 1;
            var userId = "user123";
            var response = Response<NoContentDto>.Fail(new ErrorDetail("Reservation", "Not found"), 404);
            _mockReservationService.Setup(s => s.CancelReservationAsync(reservationId, userId))
                .ReturnsAsync(response);

            // Act
            var result = await _reservationController.CancelReservation(reservationId) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task GetReservationSummary_ShouldReturn200()
        {
            // Arrange
            var todayResponse = Response<int>.Success(5, 200);
            var tomorrowResponse = Response<int>.Success(3, 200);
            _mockReservationService.Setup(s => s.GetTotalReservationsCountByDateAsync(It.Is<DateTime>(d => d.Date == DateTime.Now.Date)))
                .ReturnsAsync(todayResponse);
            _mockReservationService.Setup(s => s.GetTotalReservationsCountByDateAsync(It.Is<DateTime>(d => d.Date == DateTime.Now.AddDays(1).Date)))
                .ReturnsAsync(tomorrowResponse);

            // Act
            var result = await _reservationController.GetReservationSummary() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task GetDailyReservations_ShouldReturn200()
        {
            // Arrange
            var date = DateTime.Now;
            var response = Response<List<ReservationDto>>.Success(new List<ReservationDto>(), 200);
            _mockReservationService.Setup(s => s.GetReservationsByDateWithRelationsAsync(date))
                .ReturnsAsync(response);

            // Act
            var result = await _reservationController.GetDailyReservations(date) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }
    }
}

