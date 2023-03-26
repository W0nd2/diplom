import { IsEmail, IsString, Length } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @Length(3, 30)
  nickname: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(3, 30)
  password: string;
}
