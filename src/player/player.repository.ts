import { Injectable } from '@nestjs/common';
import { Player, PlayerDocument } from './schemas/player.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class PlayerRepository {
  constructor(
    @InjectModel(Player.name) private readonly player: Model<PlayerDocument>,
    @InjectModel(Role.name) private readonly role: Model<RoleDocument>,
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
          _id: player.id,
          nickname: player.nickname,
          email: player.email,
        };
      }),
    };
  }

  async updatePlayerById(id: ObjectId, data: UpdatePlayerDto) {
    return this.player.updateOne({ _id: id }, data);
  }

  async getRoleById(id: ObjectId) {
    return this.role.findById(id);
  }
  async getUserInfo(userId: string) {
    return this.player.aggregate([
      // {
      //   $match: {
      //     teamId: new mongoose.Types.ObjectId(teamId),
      //   },
      // },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'teammembers',
          localField: '_id',
          foreignField: 'playerId',
          as: 'teammembers',
        },
      },
      {
        $unwind: {
          path: '$teammembers',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'teammembers.teamId',
          foreignField: '_id',
          as: 'team',
        },
      },
      {
        $unwind: {
          path: '$team',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'roleId',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $unwind: {
          path: '$role',
        },
      },
      {
        $project: {
          _id: 1,
          nickname: 1,
          email: 1,
          role: 1,
          team: 1,
        },
      },
    ]);
  }
}
