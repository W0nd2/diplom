import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePlayerDto {
  @IsOptional()
  @IsString()
  @Length(3, 200)
  nickname?: string;

  @IsOptional()
  @IsString()
  @Length(3, 1000)
  email?: string;
}
