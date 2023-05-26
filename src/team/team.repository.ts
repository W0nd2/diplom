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
    const teamInfo = await this.team.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(teamId),
        },
      },
      {
        $lookup: {
          from: 'teammembers',
          localField: '_id',
          foreignField: 'teamId',
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
          from: 'players',
          localField: 'teammembers.playerId',
          foreignField: '_id',
          as: 'members',
        },
      },
    ]);
    console.log(teamInfo);
    return {
      total: teamInfo[0].members.length,
      team: {
        id: teamInfo[0]._id,
        name: teamInfo[0].name,
      },
      members: teamInfo[0].members.map((member) => {
        return {
          id: member._id,
          nickname: member.nickname,
          email: member.email,
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

  async getMyTeamInfo(user) {
    const memberOfTeam = await this.teamMember.findOne({ playerId: user.id });
    return this.getTeamInfo(memberOfTeam.teamId.toString());
  }
}
