import { IsString, Length } from 'class-validator';

export class UpdateMatchDto {
  @IsString()
  @Length(24)
  oldTeam: string;

  @IsString()
  @Length(24)
  newTeam: string;

  @IsString()
  date: string;
}
