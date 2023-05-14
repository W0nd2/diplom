import { Injectable } from '@nestjs/common';
import { PlayerRepository } from './player.repository';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Player } from './schemas/player.schema';

@Injectable()
export class PlayerService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly playerRepository: PlayerRepository,
  ) {}

  generateToken(user: Player): string {
    const payload = {
      email: user.email,
      nickname: user.nickname,
    };
    return this.jwtService.sign(payload);
  }

  async getAllPlayers(limitQ: number, offsetQ: number) {
    return this.playerRepository.getAllPlayers(limitQ, offsetQ);
  }
  async getPlayerByEmail(email: string) {
    return this.playerRepository.getPlayerByEmail(email);
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

  async getUserInfo(userId: string) {
    return this.playerRepository.getUserInfo(userId);
  }
}
