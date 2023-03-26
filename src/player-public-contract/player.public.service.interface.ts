import { GetUserResponseDto } from './dto/player.public.response.dto';
import { ObjectId } from 'mongoose';

export interface IPlayerPublicService {
  getPlayerById(id: ObjectId): Promise<GetUserResponseDto>;
}
