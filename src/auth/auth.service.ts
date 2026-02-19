import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return user;
  }

  async login(user: any) {
    return this.generateTokens(user);
  }

  async generateTokens(user: any) {
    const payload = { sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    await this.databaseService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    const stored = await this.databaseService.refreshToken.findUnique({
      where: { token },
    });

    if (!stored) throw new UnauthorizedException('Invalid refresh token.');

    if (stored.expiresAt < new Date())
      throw new UnauthorizedException('Token expired.');

    const payload = this.jwtService.verify(token);

    return this.generateTokens({ id: payload.sub });
  }
}
