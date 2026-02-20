import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/user.dto';
import { DatabaseService } from 'src/database/database.service';
import {
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
  ) {}

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    example: {
      message: 'Login successful.',
      accessToken: '',
      refreshToken: '',
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async login(@Body() body: LoginUserDto) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    if (!user) throw new UnauthorizedException('Invalid credentials.');

    await this.authService.checkSessionLimit(user.id);

    const credential = await this.authService.login(user);

    return { message: 'Login successful.', ...credential };
  }

  @Post('refresh')
  @ApiResponse({
    status: 200,
    description: 'Refresh successful.',
    example: {
      message: 'Credentials refreshed.',
      accessToken: '',
      refreshToken: '',
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async refresh(@Body() body: { refreshToken: string }) {
    const credential = await this.authService.refresh(body.refreshToken);
    return { message: 'Credentials refreshed.', ...credential };
  }

  @Post('logout')
  @ApiResponse({
    status: 200,
    description: 'Logout successful.',
    example: { message: 'Logout successful.' },
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async logout(@Body() body: { refreshToken: string }) {
    await this.databaseService.refreshToken.deleteMany({
      where: { token: body.refreshToken },
    });

    return { message: 'Logout successful.' };
  }
}
