import { Controller, Post, Body, HttpCode, HttpStatus, Put, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { UpdateProfileUseCase } from '../../application/use-cases/auth/update-profile.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/auth/change-password.use-case';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UpdateProfileDto, ChangePasswordDto } from '../dto/update-profile.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../guards/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario con email, username y password. El password se encripta automáticamente y retorna un token JWT.'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'usuario@example.com',
          username: 'johndoe',
          avatar: null,
          bio: null,
          created_at: '2025-01-09T12:00:00.000Z',
          updated_at: '2025-01-09T12:00:00.000Z'
        },
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos o email/username ya existe',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be a valid email', 'username must be longer than or equal to 3 characters'],
        error: 'Bad Request'
      }
    }
  })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.registerUseCase.execute(registerDto);
    
    const payload = { sub: user.id, email: user.email, username: user.username };
    const access_token = this.jwtService.sign(payload);

    return {
      user,
      access_token,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica al usuario con email y password. Retorna un token JWT para autenticación en endpoints protegidos.'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'usuario@example.com',
          username: 'johndoe',
          avatar: null,
          bio: null
        },
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.loginUseCase.execute(
      loginDto.email,
      loginDto.password,
    );

    const payload = { sub: user.id, email: user.email, username: user.username, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      user,
      access_token,
    };
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Obtener perfil del usuario autenticado',
    description: 'Retorna los datos completos del perfil del usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil del usuario',
    schema: {
      example: {
        id: 1,
        email: 'usuario@example.com',
        username: 'johndoe',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Escritor apasionado',
        created_at: '2025-01-09T12:00:00.000Z'
      }
    }
  })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Put('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Actualizar perfil',
    description: 'Actualiza los datos del perfil del usuario (username, email, bio, avatar)'
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil actualizado',
    schema: {
      example: {
        id: 1,
        email: 'nuevo@example.com',
        username: 'nuevo_username',
        avatar: 'https://example.com/new-avatar.jpg',
        bio: 'Nueva biografía',
        created_at: '2025-01-09T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Username o email ya existe'
  })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.updateProfileUseCase.execute(user.id, updateProfileDto);
  }

  @Put('change-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Cambiar contraseña',
    description: 'Cambia la contraseña del usuario. Requiere la contraseña actual para validación.'
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Contraseña actualizada',
    schema: {
      example: {
        message: 'Contraseña actualizada correctamente'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Contraseña actual incorrecta'
  })
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.changePasswordUseCase.execute(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}
