import { IsEmail, IsString, Length } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @Length(3, 30)
  name: string;
}
