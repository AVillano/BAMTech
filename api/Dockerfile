# need to build and publish the app first 
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . ./
RUN dotnet restore StargateAPI.csproj
RUN dotnet publish StargateAPI.csproj -c Release -o out

# now create the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
COPY --from=build /app/out .
# this should be mounted as a volume but for this purpose I am not going to do that
# firstly I am not familiar with doing that as I've always used hosted dbs previously
# secondly this is just a demo
COPY --from=build /app/Database ./Database
EXPOSE 8080
ENTRYPOINT ["dotnet", "StargateAPI.dll"]
