using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Backend.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var email = new MimeMessage();

            var senderEmail = _configuration["EmailSettings:SenderEmail"]!;
            var senderName = _configuration["EmailSettings:SenderName"] ?? "Skillvia";

            email.From.Add(new MailboxAddress(senderName, senderEmail));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;

            var builder = new BodyBuilder
            {
                HtmlBody = body
            };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();

            var host = _configuration["EmailSettings:SmtpServer"]!;
            var port = int.Parse(_configuration["EmailSettings:Port"] ?? "587");
            var password = _configuration["EmailSettings:Password"]!;

            await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(senderEmail, password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
