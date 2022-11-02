using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TicketTracking.AppBuilder;
using TicketTracking.Models;
using TicketTracking.Repostitories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<TicketsDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<TicketsDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddCors(options =>
{
    options.AddPolicy("corspolicy", (policy) =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddScoped<SecurityService>();
builder.Services.AddScoped<TicketsService>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", (policy) =>
    {
        policy.RequireRole("Administrator");
    });
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("QAPolicy", (policy) =>
    {
        policy.RequireRole("QA");
    });
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RDPolicy", (policy) =>
    {
        policy.RequireRole("RD");
    });
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("PMPolicy", (policy) =>
    {
        policy.RequireRole("PM");
    });
});

byte[] secretKey = Convert.FromBase64String(builder.Configuration["JWTCoreSettings:SecretKey"]);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(secretKey),
        ValidateIssuer = false,
        ValidateAudience = false
    };
    x.Events = new JwtBearerEvents()
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Add
                ("Authentication-Token-Expired", "true");
            }
            return Task.CompletedTask;
        }
    };
}).AddCookie(options =>
{
    options.Events.OnRedirectToAccessDenied =
    options.Events.OnRedirectToLogin = c =>
    {
        c.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.FromResult<object>(null);
    };
});


builder.Services.AddControllers().AddJsonOptions(options => {
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JSON Web Token Authorization header using the Bearer scheme.\"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });


    options.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("corspolicy");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

// Create DefaultAdminsistrator User
IServiceProvider serviceProvider = builder.Services.BuildServiceProvider();
await Seed.CreateApplicationAdministrator(serviceProvider);

app.MapControllers();

app.Run();
