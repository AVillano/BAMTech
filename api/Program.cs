using Microsoft.EntityFrameworkCore;
using StargateAPI.Business.Commands;
using StargateAPI.Business.Data;
using Microsoft.AspNetCore.SpaServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<StargateContext>(options => 
    options.UseSqlite(builder.Configuration.GetConnectionString("StarbaseApiDatabase")));

builder.Services.AddMediatR(cfg =>
{
    cfg.AddRequestPreProcessor<CreateAstronautDutyPreProcessor>();
    // Person
    cfg.AddRequestPreProcessor<CreatePersonPreProcessor>();
    cfg.AddRequestPreProcessor<UpdatePersonPreProcessor>();

    cfg.RegisterServicesFromAssemblies(typeof(Program).Assembly);
});
builder.Services.AddLogging(opt =>
{
    opt.AddSimpleConsole(c =>
    {
        c.TimestampFormat = "yyyy-MM-dd HH:mm:ss ";
        c.UseUtcTimestamp = true;
    });
});

//builder.Services.AddSpaStaticFiles(options =>
//{
//    options.RootPath = "UI/dist";
//}); 

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//else
//{
//    app.UseSpaStaticFiles();
//    /*app.UseSpa(spa =>
//    {
//        spa.Options.SourcePath
//    })*/
//}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();


