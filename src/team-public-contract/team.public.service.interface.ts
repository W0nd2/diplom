import { GetTeamResponseDto } from './dto/team.public.response.dto';

export interface ITeamPublicService {
  getTeamById(id: string): Promise<GetTeamResponseDto>;
}
