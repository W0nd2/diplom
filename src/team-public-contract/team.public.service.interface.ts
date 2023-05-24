import { GetTeamResponseDto } from './dto/team.public.response.dto';
import { ObjectId } from 'mongoose';

export interface ITeamPublicService {
  getTeamById(id: string | ObjectId): Promise<GetTeamResponseDto>;
}
