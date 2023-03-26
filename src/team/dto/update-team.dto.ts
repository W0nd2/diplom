import { IsString, Length } from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @Length(3, 200)
  name: string;
}
