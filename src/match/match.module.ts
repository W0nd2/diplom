import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchController } from './match.controller';
import { MatchRepository } from './match.repository';
import { MatchService } from './match.service';
import { TeamPublicService } from '../team/team.public.service';
import { TeamRepository } from '../team/team.repository';
import { TeamService } from '../team/team.service';
import { Team, TeamSchema } from '../team/schemas/team.schema';
import {
  TeamMember,
  TeamMemberSchema,
} from '../team/schemas/team-member.schema';

const matchFeature = MongooseModule.forFeature([
  { name: Match.name, schema: MatchSchema },
]);
const teamFeature = MongooseModule.forFeature([
  { name: Team.name, schema: TeamSchema },
]);
const teamMemberFeature = MongooseModule.forFeature([
  { name: TeamMember.name, schema: TeamMemberSchema },
]);

@Module({
  imports: [matchFeature, teamFeature, teamMemberFeature],
  controllers: [MatchController],
  providers: [
    MatchRepository,
    MatchService,
    TeamService,
    TeamRepository,
    TeamPublicService,
    {
      provide: 'ITeamPublicService',
      useClass: TeamPublicService,
    },
  ],
  exports: [
    MatchRepository,
    MatchService,
    matchFeature,
    teamFeature,
    teamMemberFeature,
    TeamService,
    TeamRepository,
    TeamPublicService,
  ],
})
export class MatchModule {}
