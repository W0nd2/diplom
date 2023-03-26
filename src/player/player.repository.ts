import { Injectable } from '@nestjs/common';
import { Player, PlayerDocument } from './schemas/player.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayerRepository {
  constructor(
    @InjectModel(Player.name) private readonly player: Model<PlayerDocument>,
  ) {}

  async createPlayer(data) {
    return this.player.create(data);
  }

  async getPlayerByEmailOrNickname(
    email: string,
    nickname: string,
  ): Promise<PlayerDocument> {
    return this.player.findOne({
      $or: [{ email: email }, { nickname: nickname }],
    });
  }
  async getPlayerByEmail(email: string): Promise<PlayerDocument> {
    return this.player.findOne({ email: email });
  }

  async getPlayerById(id: ObjectId): Promise<PlayerDocument> {
    return this.player.findById(id);
  }

  async deletePlayer(id: ObjectId) {
    return this.player.deleteOne({ _id: id });
  }

  async getAllPlayers(limit: number, offset: number) {
    const playersAmount = (await this.player.find({})).length;
    const allPlayers = await this.player.find().skip(offset).limit(limit);
    return {
      limit: limit,
      offset: offset,
      total: playersAmount,
      players: allPlayers.map((player) => {
        return {
          nickname: player.nickname,
          email: player.email,
        };
      }),
    };
  }

  async updatePlayerById(id: ObjectId, data: UpdatePlayerDto) {
    return this.player.updateOne({ _id: id }, data);
  }
}
