import { Injectable } from '@nestjs/common';
import { MatchRepository } from './match.repository';
import { CreateMatchDto } from './dto/create-match.dto';
import { ObjectId } from 'mongoose';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchService {
  constructor(private readonly matchRepository: MatchRepository) {}

  async createMatch(data: CreateMatchDto) {
    await this.matchRepository.createMatch(data);
  }

  async findMatch(data: CreateMatchDto) {
    return this.matchRepository.findMatch(data);
  }

  async findTeamInMatch(
    date: string,
    firstTeamId: string,
    secondTeamId?: string,
  ) {
    const firstTeam = await this.matchRepository.findTeamInMatch(
      date,
      firstTeamId,
    );
    let secondTeam;
    // if (secondTeamId) {
    //   secondTeam = await this.matchRepository.findTeamInMatch(
    //     date,
    //     secondTeamId,
    //   );
    //   if (firstTeam) {
    //     return []
    //   }
    //   return secondTeam
    // }
    return firstTeam;
  }

  async getMatchById(matchId: ObjectId) {
    return this.matchRepository.getMatchById(matchId);
  }

  async deleteMatch(matchId: ObjectId) {
    return this.matchRepository.deleteMatch(matchId);
  }

  async updateTeam(data: UpdateMatchDto) {
    await this.matchRepository.updateTeam(data);
  }

  async updateDate(matchId: ObjectId, newDate: string) {
    await this.matchRepository.updateDate(matchId, newDate);
  }

  async getAllMatches(limit: number, offset: number) {
    return this.matchRepository.getAllMatches(limit, offset);
  }
}
