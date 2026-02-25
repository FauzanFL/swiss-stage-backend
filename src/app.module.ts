import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TournamentModule } from './tournament/tournament.module';
import { ParticipantModule } from './participant/participant.module';
import { RoundModule } from './round/round.module';
import { MatchModule } from './match/match.module';
import { PairingModule } from './pairing/pairing.module';
import { StandingsModule } from './standings/standings.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
import { DatabaseService } from './database/database.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    TournamentModule,
    ParticipantModule,
    RoundModule,
    MatchModule,
    PairingModule,
    StandingsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    UserService,
    DatabaseService,
    JwtService,
    AuthService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
