import { Injectable } from '@nestjs/common';
import { PlayerService } from './player.service';
import { GetUserResponseDto } from '../player-public-contract/dto/player.public.response.dto';
import { IPlayerPublicService } from '../player-public-contract/player.public.service.interface';
import { ObjectId } from 'mongoose';

@Injectable()
export class PlayerPublicService implements IPlayerPublicService {
  constructor(private readonly playerService: PlayerService) {}

  public async getPlayerById(id: ObjectId): Promise<GetUserResponseDto> {
    const player = await this.playerService.getPlayerById(id);
    return {
      id: player.id,
      nickname: player.nickname,
    };
  }
}
