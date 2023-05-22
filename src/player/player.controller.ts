import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PlayerRepository } from './player.repository';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import * as bcryptjs from 'bcryptjs';
import { ToNumberPipe } from '../pipes/to-number.pipe';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ObjectId } from 'mongoose';
import { IsLogedInGuard } from '../guards/is-loged-in.guard';
import { LoginDto } from './dto/login.dto';

@Controller('player')
export class PlayerController {
  private bcryptjs: any;
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly playerService: PlayerService,
  ) {}

  @UseGuards(IsLogedInGuard)
  @Get()
  async getAllPlayers(
    @Query('limit', ToNumberPipe) limitQ = 9,
    @Query('offset', ToNumberPipe) offsetQ = 0,
  ): Promise<any> {
    return this.playerService.getAllPlayers(limitQ, offsetQ);
  }

  @Post('/register')
  async registration(@Body() dto: CreatePlayerDto): Promise<any> {
    const user = await this.playerRepository.getPlayerByEmailOrNickname(
      dto.email,
      dto.nickname,
    );
    if (user) {
      throw new HttpException('This email or nickname is already in use', 400);
    }
    const hashPassword = await bcryptjs.hash(dto.password!, 5);
    const newUser = await this.playerRepository.createPlayer({
      ...dto,
      password: hashPassword,
      roleId: '64556454c6c2cd57a207f2c5',
    });
    const role = await this.playerRepository.getRoleById(newUser.roleId);
    //return { message: 'Success registration!' };
    const token = this.playerService.generateToken(newUser);
    return { token, role };
  }

  @Post('/login')
  async login(@Body() dto: LoginDto): Promise<any> {
    const user = await this.playerService.getPlayerByEmail(dto.email);
    if (!user) throw new HttpException('Incorrect data', 400);
    const comparePasswords = await bcryptjs.compare(
      dto.password,
      user.password,
    );
    if (!comparePasswords) throw new HttpException('Incorrect data', 400);
    // const isBanned = await this.userService.isBanned(user._id);
    // if (isBanned) throw new HttpException('You are banned', 403);
    const role = await this.playerRepository.getRoleById(user.roleId);
    const token = this.playerService.generateToken(user);

    return { token, role };
  }

  @UseGuards(IsLogedInGuard)
  @Delete(':playerId')
  async deletePlayerById(@Param('playerId') playerId: ObjectId) {
    if (!playerId) {
      throw new HttpException('Incorrect playerId', 400);
    }
    const user = this.playerRepository.getPlayerById(playerId);
    if (!user) {
      throw new HttpException('No users with such id', 400);
    }
    await this.playerService.deletePlayerById(playerId);
    return {
      message: `Player with this id ${playerId} was deleted successfully`,
    };
  }

  @UseGuards(IsLogedInGuard)
  @Put(':playerId')
  async updatePlayerById(
    @Param('playerId') playerId: ObjectId,
    @Body() dto: UpdatePlayerDto,
    @Req() req: Request,
  ) {
    const userReq = req.user;
    console.log(userReq);
    if (!playerId) {
      throw new HttpException('Incorrect playerId', 400);
    }
    const user = this.playerRepository.getPlayerById(playerId);
    if (!user) {
      throw new HttpException('No users with such id', 400);
    }
    await this.playerService.updatePlayerById(playerId, dto);
    return {
      message: `Player with this id ${playerId} was updated successfully`,
    };
  }

  @UseGuards(IsLogedInGuard)
  @Get('profile')
  async getCurrentUser(@Req() req: Request) {
    const userReq = req.user;
    console.log(userReq);
    if (!userReq) {
      throw new HttpException('Access deny', 400);
    }
    const user = await this.playerRepository.getPlayerByEmail(userReq.email);
    if (!user) {
      throw new HttpException('No users with such id', 400);
    }
    const userInfo = await this.playerService.getUserInfo(user.id);
    return userInfo;
  }
}
