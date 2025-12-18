import { Controller, Delete, Body, UseGuards, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../guards/current-user.decorator';
import { DeleteAccountUseCase } from '../../application/use-cases/auth/delete-account.use-case';
import { DeleteAccountDto } from '../dto/delete-account.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
  ) {}

  @Delete('delete-account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar cuenta de usuario',
    description: 'Elimina permanentemente la cuenta del usuario autenticado. Esta acción es irreversible.'
  })
  @ApiBody({ type: DeleteAccountDto })
  @ApiResponse({ 
    status: 204, 
    description: 'Cuenta eliminada exitosamente'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Contraseña incorrecta'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token no válido'
  })
  async deleteAccount(
    @CurrentUser() user: any,
    @Body() deleteAccountDto: DeleteAccountDto,
  ): Promise<void> {
    await this.deleteAccountUseCase.execute(user.id, deleteAccountDto.password);
  }
}