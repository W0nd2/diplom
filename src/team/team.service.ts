import { Injectable } from '@nestjs/common';
import { TeamRepository } from './team.repository';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamDocument } from './schemas/team.schema';
import { UpdateTeamDto } from "./dto/update-team.dto";
import { ObjectId } from "mongoose";

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async createTeam(data: CreateTeamDto): Promise<TeamDocument> {
    return this.teamRepository.createTeam(data);
  }

  async getTeamByName(teamName: string): Promise<TeamDocument> {
    return this.teamRepository.getTeamByName(teamName);
  }

  async getTeamById(id: ObjectId | string): Promise<TeamDocument> {
    return this.teamRepository.getTeamById(id);
  }

  async getAllTeams(limitQ: number, offsetQ: number) {
    return this.teamRepository.getAllTeams(limitQ, offsetQ);
  }

  async deleteTeam(id: ObjectId) {
    return this.teamRepository.deleteTeam(id);
  }

  async updateTeam(teamId: ObjectId, data: UpdateTeamDto) {
    return this.teamRepository.updateTeam(teamId, data);
  }

  async getTeamInfo(teamId: string) {
    return this.teamRepository.getTeamInfo(teamId);
  }

  async addPlayerToTeam(teamId: ObjectId | string, playerId: ObjectId) {
    return this.teamRepository.addPlayerToTeam(teamId, playerId);
  }

  async userOnTeam(playerId: ObjectId) {
    return this.teamRepository.userOnTeam(playerId);
  }

  async deleteMemberFromTeam(teamId: ObjectId, playerId: ObjectId) {
    return this.teamRepository.deleteMemberFromTeam(teamId, playerId);
  }

  async getMyTeamInfo(user) {
    return this.teamRepository.getMyTeamInfo(user);
  }
}
