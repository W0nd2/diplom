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
import { JwtModule } from '@nestjs/jwt';
import { Role, RoleSchema } from '../player/schemas/role.schema';

const teamFeature = MongooseModule.forFeature([
  { name: Team.name, schema: TeamSchema },
]);
const teamMemberFeature = MongooseModule.forFeature([
  { name: TeamMember.name, schema: TeamMemberSchema },
]);
const playerFeature = MongooseModule.forFeature([
  { name: Player.name, schema: PlayerSchema },
]);
const roleFeature = MongooseModule.forFeature([
  { name: Role.name, schema: RoleSchema },
]);

const jwtRegister = JwtModule.register({
  secret: process.env.JWT_SECRET || 'JWTSECRET',
  signOptions: {
    expiresIn: '1h',
  },
});

@Module({
  controllers: [TeamController],
  imports: [
    jwtRegister,
    teamFeature,
    teamMemberFeature,
    playerFeature,
    roleFeature,
  ],
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
    jwtRegister,
    TeamService,
    TeamRepository,
    playerFeature,
    roleFeature,
    PlayerService,
    PlayerRepository,
    PlayerPublicService,
    TeamPublicService,
  ],
})
export class TeamModule {}
