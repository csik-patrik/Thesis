# ── 1. Build stage ──────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Csak a csproj-t másoljuk először → réteg-cache a restore-hoz
COPY *.csproj ./
RUN dotnet restore

# Forrás másolása és publish
COPY . .
RUN dotnet publish -c Release -o /app/publish

# ── 2. Runtime stage ─────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Biztonsági bevált gyakorlat: ne root-ként fusson
RUN adduser --disabled-password --gecos "" appuser
USER appuser

COPY --from=build /app/publish .

# Health check az orchestratornak (Docker / Compose)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

EXPOSE 8080
ENTRYPOINT ["dotnet", "ThesisApi.dll"]
# ↑ Cseréld le a tényleges DLL névre (általában a projekt neve)
