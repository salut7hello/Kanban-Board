# Kanban-Board
Enkel kanban-app . Frontend lagrer lokalt med **Dexie/IndexedDB**, og kan synke mot en liten ASP.NET Core -backend.

## Stack
- Frontend: React + TypeScript (Vite) + Tailwind + Dexie
- Backend: ASP.NET Core (C#) Minimal API

## Kom i gang
**Krav:** Node 18+ og .NET SDK 8+

```Bach```
# Backend
cd server
dotnet restore && dotnet run   # http://localhost:

# Frontend
cd client
npm install
npm run dev                    # http://localhost:
