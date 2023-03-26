import { Injectable } from '@nestjs/common';
import { PlayerRepository } from './player.repository';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ObjectId } from 'mongoose';

@Injectable()
export class PlayerService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async getAllPlayers(limitQ: number, offsetQ: number) {
    return this.playerRepository.getAllPlayers(limitQ, offsetQ);
  }
  async deletePlayerById(id: ObjectId) {
    return this.playerRepository.deletePlayer(id);
  }

  async updatePlayerById(id: ObjectId, data: UpdatePlayerDto) {
    return this.playerRepository.updatePlayerById(id, data);
  }

  async getPlayerById(id: ObjectId) {
    return this.playerRepository.getPlayerById(id);
  }
}
