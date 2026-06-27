# api-cuentos

REST API para la plataforma de cuentos digitales. Construida con **NestJS**, **TypeORM** y **MySQL**, siguiendo principios de **Clean Architecture**.

## Tecnologías

- **Runtime:** Node.js + TypeScript
- **Framework:** NestJS 11
- **Base de datos:** MySQL (TypeORM 0.3)
- **Autenticación:** JWT + Passport
- **Documentación:** Swagger / OpenAPI
- **Validación:** class-validator + class-transformer

## Arquitectura

```
src/
├── domain/               # Entidades del negocio e interfaces de repositorio
│   ├── entities/
│   └── repositories/
├── application/          # Casos de uso, módulos y DTOs
│   ├── modules/
│   ├── use-cases/
│   │   ├── admin/        # 6 servicios especializados de administración
│   │   ├── auth/
│   │   ├── comments/
│   │   ├── likes/
│   │   ├── notifications/
│   │   ├── release-notes/
│   │   └── stories/
│   └── dto/
├── infrastructure/       # Implementaciones de repositorios y configuración BD
│   ├── database/
│   │   ├── migrations/
│   │   └── typeorm/
│   │       ├── entities/   # Schemas TypeORM
│   │       └── repositories/
│   └── file-storage/
└── presentation/         # Controllers, Guards y Decoradores
    ├── controllers/
    ├── guards/
    └── dto/
```

## Requisitos previos

- Node.js >= 18
- MySQL >= 8
- npm >= 9

## Configuración

```bash
# Clonar e instalar dependencias
npm install

# Copiar el archivo de entorno y completar los valores
cp .env.example .env
```

Variables de entorno requeridas en `.env`:

| Variable | Descripción |
|---|---|
| `DATABASE_HOST` | Host del servidor MySQL |
| `DATABASE_PORT` | Puerto MySQL (default: 3306) |
| `DATABASE_USER` | Usuario de la base de datos |
| `DATABASE_PASSWORD` | Contraseña de la base de datos |
| `DATABASE_NAME` | Nombre de la base de datos |
| `JWT_SECRET` | Secreto para firmar tokens JWT |
| `JWT_EXPIRES_IN` | Expiración del token (ej: `7d`) |
| `CORS_ORIGINS` | Orígenes permitidos separados por coma |

## Base de datos

```bash
# Correr todas las migraciones pendientes
npm run migration:run

# Revertir la última migración
npm run migration:revert

# Generar una nueva migración basada en cambios de entidades
npm run migration:generate -- src/infrastructure/database/migrations/NombreMigracion

# Crear un archivo de migración vacío
npm run migration:create -- src/infrastructure/database/migrations/NombreMigracion
```

## Levantar el servidor

```bash
# Desarrollo con hot-reload
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Documentación de la API

Con el servidor corriendo, accede a Swagger en:

```
http://localhost:3000/api/docs
```

## Módulos principales

| Módulo | Endpoints base | Descripción |
|---|---|---|
| Auth | `/auth` | Registro, login, perfil |
| Stories | `/stories` | CRUD de cuentos y capítulos |
| Comments | `/stories/:id/comments` | Comentarios y respuestas |
| Likes | `/stories/:id/likes` | Sistema de likes |
| Notifications | `/notifications` | Notificaciones de usuario |
| Release Notes | `/release-notes` | Notas de versión públicas |
| Admin | `/admin` | Panel de administración |
| Version | `/version` | Estado y versión del sistema |

## Crear usuario administrador

```bash
npm run create-admin
```

## Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Cobertura
npm run test:cov
```

## Changelog

### v2.0.0
- Refactorización completa siguiendo Clean Architecture
- `AdminService` (860 líneas) dividido en 6 servicios especializados
- Dependencias actualizadas a versiones estables más recientes
- Unificación de variables de entorno a convención `DATABASE_*`
- Eliminación de carpetas legacy duplicadas
- Corrección de bugs en estadísticas del sistema
- Mejora de seguridad en backup de base de datos
