import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/user.schema';
import { DatabaseService } from 'src/database/database.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    if (!user) throw new UnauthorizedException('Invalid credentials.');

    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    await this.databaseService.refreshToken.deleteMany({
      where: { token: body.refreshToken },
    });

    return { message: 'Logout successful.' };
  }
}
