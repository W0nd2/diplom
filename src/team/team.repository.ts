import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Team, TeamDocument } from './schemas/team.schema';
import { TeamMember, TeamMemberDocument } from './schemas/team-member.schema';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamRepository {
  constructor(
    @InjectModel(Team.name) private readonly team: Model<TeamDocument>,
    @InjectModel(TeamMember.name)
    private readonly teamMember: Model<TeamMemberDocument>,
  ) {}
  async createTeam(data: CreateTeamDto): Promise<TeamDocument> {
    return this.team.create(data);
  }
  async getTeamByName(teamName: string): Promise<TeamDocument> {
    return this.team.findOne({ name: teamName });
  }
  async getTeamById(id: ObjectId | string): Promise<TeamDocument> {
    return this.team.findById(id);
  }
  async getAllTeams(limit: number, offset: number) {
    const teamsAmount = (await this.team.find({})).length;
    const allTeams = await this.team.find().skip(offset).limit(limit);
    return {
      limit: limit,
      offset: offset,
      total: teamsAmount,
      teams: allTeams.map((team) => {
        return {
          id: team._id,
          name: team.name,
        };
      }),
    };
  }
  async deleteTeam(teamId: ObjectId) {
    await this.team.deleteOne({ _id: teamId });
    await this.teamMember.deleteMany({ teamId: teamId });
  }
  async updateTeam(teamId: ObjectId, data: UpdateTeamDto) {
    return this.team.updateOne({ _id: teamId }, data);
  }

  async getTeamInfo(teamId: string) {
    const members = await this.teamMember.aggregate([
      {
        $match: {
          teamId: new mongoose.Types.ObjectId(teamId),
        },
      },
      {
        $lookup: {
          from: 'players',
          localField: 'playerId',
          foreignField: '_id',
          as: 'players',
        },
      },
      {
        $unwind: {
          path: '$players',
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: '_id',
          as: 'team',
        },
      },
      {
        $unwind: {
          path: '$team',
        },
      },
      {
        $project: {
          team: 1,
          players: 1,
        },
      },
    ]);
    return {
      total: members.length,
      team: {
        id: members[0]?.team._id,
        name: members[0]?.team.name,
      },
      members: members.map((member) => {
        return {
          id: member.players._id,
          nickname: member.players.nickname,
          email: member.players.email,
        };
      }),
    };
  }

  async addPlayerToTeam(teamId: ObjectId | string, playerId: ObjectId) {
    return this.teamMember.create({ teamId: teamId, playerId: playerId });
  }

  async userOnTeam(playerId: ObjectId) {
    return this.teamMember.find({ playerId: playerId });
  }

  async deleteMemberFromTeam(teamId: ObjectId, playerId: ObjectId) {
    const test = await this.teamMember.deleteOne({
      teamId: teamId,
      playerId: playerId,
    });
    console.log(test);
    return test;
  }
}
