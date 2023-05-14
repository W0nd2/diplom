import { Player, PlayerSchema } from './schemas/player.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';
import { PlayerService } from './player.service';
import { PlayerPublicService } from './player.public.service';
import { Role, RoleSchema } from './schemas/role.schema';
import { JwtModule } from '@nestjs/jwt';

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
  imports: [jwtRegister, playerFeature, roleFeature],
  controllers: [PlayerController],
  providers: [
    PlayerRepository,
    PlayerPublicService,
    PlayerService,
    {
      provide: 'IPlayerPublicService',
      useClass: PlayerPublicService,
    },
  ],
  exports: [
    jwtRegister,
    PlayerRepository,
    PlayerService,
    PlayerPublicService,
    playerFeature,
    roleFeature,
  ],
})
export class PlayerModule {}
