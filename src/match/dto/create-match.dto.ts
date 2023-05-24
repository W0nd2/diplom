import { IsDate, IsString, Length } from 'class-validator';
import { ObjectId } from "mongoose";

export class CreateMatchDto {
  @IsString()
  @Length(24)
  firstTeam: string;

  @IsString()
  @Length(24)
  secondTeam: string;

  @IsString()
  startDate: string;
}
