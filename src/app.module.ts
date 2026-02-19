import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TournamentModule } from './tournament/tournament.module';
import { ParticipantModule } from './participant/participant.module';
import { RoundModule } from './round/round.module';
import { MatchModule } from './match/match.module';
import { PairingModule } from './pairing/pairing.module';
import { StandingsModule } from './standings/standings.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TournamentModule,
    ParticipantModule,
    RoundModule,
    MatchModule,
    PairingModule,
    StandingsModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
