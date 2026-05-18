# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore dependencies first (layer cache optimization)
COPY RecipeBackend.csproj .
RUN dotnet restore

# Copy everything else and publish
COPY . .
RUN dotnet publish RecipeBackend.csproj -c Release -o /app/publish --no-restore

# ── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published output from build stage
COPY --from=build /app/publish .

# Copy seed images into the container (avatars + recipe images)
# Note: user-uploaded files at runtime are ephemeral on Render free tier.
# Consider using cloud storage (Cloudinary, Supabase Storage) for user uploads.
COPY wwwroot/ ./wwwroot/

# Render assigns a PORT env variable — ASP.NET Core reads ASPNETCORE_URLS
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}

EXPOSE 8080

ENTRYPOINT ["dotnet", "RecipeBackend.dll"]