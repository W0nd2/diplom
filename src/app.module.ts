import { Module } from '@nestjs/common';
import { AppImportsLoader } from './app-imports-loader';
import { PlayerModule } from './player/player.module';
import { TeamModule } from './team/team.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    ...AppImportsLoader.load('configs/imports/*.imports.{ts,js}'),
    PlayerModule,
    TeamModule,
    MatchModule,
  ],
})
export class AppModule {}
