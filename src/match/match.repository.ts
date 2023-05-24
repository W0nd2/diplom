import { Injectable } from '@nestjs/common';
import { Match, MatchDocument } from './schemas/match.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchRepository {
  constructor(
    @InjectModel(Match.name) private readonly match: Model<MatchDocument>,
  ) {}

  async createMatch(data: CreateMatchDto) {
    // data.firstTeam = new mongoose.Types.ObjectId(data.firstTeam);
    // data.secondTeam = new mongoose.Types.ObjectId(data.secondTeam);
    // const firstTeam = new mongoose.Types.ObjectId(data.firstTeam);
    // const secondTeam = new mongoose.Types.ObjectId(data.secondTeam);
    // await this.match.create({
    //   firstTeam: firstTeam,
    //   secondTeam: secondTeam,
    //   startDate: data.startDate,
    // });
    await this.match.create(data);
  }

  async findMatch(data: CreateMatchDto): Promise<MatchDocument> {
    return this.match.findOne(data);
  }

  async findTeamInMatch(
    date: string,
    teamId: string | ObjectId,
  ): Promise<MatchDocument> {
    return this.match.findOne({ startDate: date }).and([
      {
        $or: [{ firstTeam: teamId }, { secondTeam: teamId }],
      },
    ]);
  }

  async getAllMatches(limit: number, offset: number) {
    return this.match
      .aggregate([
        {
          $lookup: {
            from: 'teams',
            localField: 'firstTeam',
            foreignField: '_id',
            as: 'firstTeam',
          },
        },
        {
          $lookup: {
            from: 'teams',
            localField: 'secondTeam',
            foreignField: '_id',
            as: 'secondTeam',
          },
        },
        {
          $unwind: {
            path: '$firstTeam',
          },
        },
        {
          $unwind: {
            path: '$secondTeam',
          },
        },
      ])
      .skip(offset)
      .limit(limit);
  }

  async getMatchById(matchId: ObjectId) {
    return this.match.findOne({ _id: matchId });
  }

  async deleteMatch(matchId: ObjectId) {
    await this.match.deleteOne({ _id: matchId });
  }

  async updateTeam(data: UpdateMatchDto) {
    const teamInMatch = await this.findTeamInMatch(data.date, data.oldTeam);
    if (teamInMatch.firstTeam === data.oldTeam) {
      await this.match.updateOne(
        {
          startDate: data.date,
          $or: [{ firstTeam: data.oldTeam }, { secondTeam: data.oldTeam }],
        },
        {
          firstTeam: data.newTeam,
        },
      );
    }
    if (teamInMatch.secondTeam === data.oldTeam) {
      await this.match.updateOne(
        {
          startDate: data.date,
          $or: [{ firstTeam: data.oldTeam }, { secondTeam: data.oldTeam }],
        },
        {
          secondTeam: data.newTeam,
        },
      );
    }
  }

  async updateDate(matchId: ObjectId, newDate: string) {
    await this.match.updateOne({ _id: matchId }, { startDate: newDate });
  }

  async getMatchByDate(date: string) {
    //return this.match.findOne({startDate: date})
    return this.match.aggregate([
      {
        $match: {
          startDate: new Date(date),
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'firstTeam',
          foreignField: '_id',
          as: 'firstTeam',
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'secondTeam',
          foreignField: '_id',
          as: 'secondTeam',
        },
      },
      {
        $unwind: {
          path: '$firstTeam',
        },
      },
      {
        $unwind: {
          path: '$secondTeam',
        },
      },
    ]);
  }

  async setWinner(matchId: ObjectId, winnerId: ObjectId) {
    const updatedMatch = await this.match.updateOne(
      { _id: matchId },
      { winner: winnerId },
    );
    console.log(updatedMatch);
    return updatedMatch;
  }
}
