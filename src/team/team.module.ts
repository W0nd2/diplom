import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamMember, TeamMemberSchema } from './schemas/team-member.schema';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { TeamController } from './team.controller';
import { PlayerPublicService } from '../player/player.public.service';
import { PlayerService } from '../player/player.service';
import { Player, PlayerSchema } from '../player/schemas/player.schema';
import { PlayerRepository } from '../player/player.repository';
import { TeamPublicService } from './team.public.service';

const teamFeature = MongooseModule.forFeature([
  { name: Team.name, schema: TeamSchema },
]);
const teamMemberFeature = MongooseModule.forFeature([
  { name: TeamMember.name, schema: TeamMemberSchema },
]);
const playerFeature = MongooseModule.forFeature([
  { name: Player.name, schema: PlayerSchema },
]);

@Module({
  controllers: [TeamController],
  imports: [teamFeature, teamMemberFeature, playerFeature],
  providers: [
    TeamService,
    TeamRepository,
    PlayerService,
    PlayerRepository,
    PlayerPublicService,
    {
      provide: 'IPlayerPublicService',
      useClass: PlayerPublicService,
    },
    TeamPublicService,
    {
      provide: 'ITeamPublicService',
      useClass: TeamPublicService,
    },
  ],
  exports: [
    TeamService,
    TeamRepository,
    playerFeature,
    PlayerService,
    PlayerRepository,
    PlayerPublicService,
    TeamPublicService,
  ],
})
export class TeamModule {}
