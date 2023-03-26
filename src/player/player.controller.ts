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
} from '@nestjs/common';
import { PlayerRepository } from './player.repository';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import * as bcryptjs from 'bcryptjs';
import { ToNumberPipe } from '../pipes/to-number.pipe';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ObjectId } from 'mongoose';

@Controller('player')
export class PlayerController {
  private bcryptjs: any;
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly playerService: PlayerService,
  ) {}

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
    //const userRole = await this.roleService.getRoleByName(RoleType.User);
    //if (!userRole) throw new NotFoundException('The user role was not found');
    const hashPassword = await bcryptjs.hash(dto.password!, 5);
    const newUser = await this.playerRepository.createPlayer({
      ...dto,
      password: hashPassword,
      //roleId: userRole.id,
    });
    return { message: 'Success registration!' };
    //const token = this.userService.generateToken(newUser);
    //return { token };
  }

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

  @Put(':playerId')
  async updatePlayerById(
    @Param('playerId') playerId: ObjectId,
    @Body() dto: UpdatePlayerDto,
  ) {
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
}
