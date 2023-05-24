import { IsString, Length } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UpdateMatchDto {
  @IsString()
  @Length(24)
  oldTeam: ObjectId | string;

  @IsString()
  @Length(24)
  newTeam: ObjectId | string;

  @IsString()
  date: string;
}
