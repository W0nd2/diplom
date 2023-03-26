import { Player, PlayerSchema } from './schemas/player.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';
import { PlayerService } from './player.service';
import { PlayerPublicService } from './player.public.service';

const playerFeature = MongooseModule.forFeature([
  { name: Player.name, schema: PlayerSchema },
]);

@Module({
  imports: [playerFeature],
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
    PlayerRepository,
    PlayerService,
    playerFeature,
    PlayerPublicService,
  ],
})
export class PlayerModule {}
