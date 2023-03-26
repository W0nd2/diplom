import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { TeamService } from './team.service';
import { GetTeamResponseDto } from '../team-public-contract/dto/team.public.response.dto';
import { ITeamPublicService } from '../team-public-contract/team.public.service.interface';

@Injectable()
export class TeamPublicService implements ITeamPublicService {
  constructor(private readonly teamService: TeamService) {}

  public async getTeamById(id: string): Promise<any> {
    const team = await this.teamService.getTeamById(id);
    return team;
    // return {
    //   id: team.id,
    //   name: team.name,
    // };
  }
}
