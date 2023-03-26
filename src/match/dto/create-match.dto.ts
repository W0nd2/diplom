import { IsDate, IsString, Length } from 'class-validator';

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
