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
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { ModuleRef } from '@nestjs/core';
import { ITeamPublicService } from '../team-public-contract/team.public.service.interface';
import { ObjectId } from 'mongoose';
import { ValidateMongooseIdPipe } from '../pipes/validate-mongoose-id.pipe';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ToNumberPipe } from '../pipes/to-number.pipe';

@Controller('match')
export class MatchController {
  private teamPublicService: ITeamPublicService;
  constructor(
    private moduleRef: ModuleRef,
    private readonly matchService: MatchService,
  ) {}

  async onModuleInit() {
    this.teamPublicService = await this.moduleRef.resolve('ITeamPublicService');
  }

  @Post('/create')
  async createTeam(@Body() dto: CreateMatchDto) {
    const date = new Date(dto.startDate);
    if (isNaN(date.getTime())) {
      throw new HttpException('This date is invalid', 400);
    }
    //check teams
    const firstTeam = await this.teamPublicService.getTeamById(dto.firstTeam);
    if (!firstTeam) {
      throw new HttpException(
        `Team with id ${dto.firstTeam} does not exists`,
        400,
      );
    }
    const secondTeam = await this.teamPublicService.getTeamById(dto.secondTeam);
    if (!secondTeam) {
      throw new HttpException(
        `Team with id ${dto.secondTeam} does not exists`,
        400,
      );
    }
    //check if team or teams take participants in match
    const firstTeamInMatch = await this.matchService.findTeamInMatch(
      dto.startDate,
      dto.firstTeam,
      //dto.secondTeam,
    );
    if (firstTeamInMatch) {
      throw new HttpException(
        `This team ${firstTeamInMatch} already in match`,
        400,
      );
    }
    const secondTeamInMatch = await this.matchService.findTeamInMatch(
      dto.startDate,
      //dto.firstTeam,
      dto.secondTeam,
    );
    if (secondTeamInMatch) {
      throw new HttpException(
        `This team ${secondTeamInMatch} already in match`,
        400,
      );
    }
    //check if match already exist with this teams
    const match = await this.matchService.findMatch(dto);
    if (match) {
      throw new HttpException('This match is already exists', 400);
    }
    await this.matchService.createMatch(dto);
  }

  @Delete(':matchId')
  async deleteMatch(
    @Param('matchId', ValidateMongooseIdPipe) matchId: ObjectId,
  ) {
    if (!matchId) {
      throw new HttpException('Incorrect teamId', 400);
    }
    const match = await this.matchService.getMatchById(matchId);
    if (!match) {
      throw new HttpException('Match with such id does not exists', 400);
    }
    await this.matchService.deleteMatch(matchId);
    return {
      message: `Match with this id ${matchId} was deleted successfully`,
    };
  }

  @Put(':matchId')
  async updateTeam(
    @Param('matchId', ValidateMongooseIdPipe) matchId: ObjectId,
    @Body() dto: UpdateMatchDto,
  ) {
    if (!matchId) {
      throw new HttpException('Incorrect teamId', 400);
    }
    const match = await this.matchService.getMatchById(matchId);
    if (!match) {
      throw new HttpException('Match with such id does not exists', 400);
    }
    await this.matchService.updateTeam(dto);
  }

  @Put(':matchId/:newDate')
  async updateDate(
    @Param('matchId', ValidateMongooseIdPipe) matchId: ObjectId,
    @Param('newDate') newDate: string,
  ) {
    if (!matchId) {
      throw new HttpException('Incorrect teamId', 400);
    }
    const date = new Date(newDate);
    if (isNaN(date.getTime())) {
      throw new HttpException('This date is invalid', 400);
    }
    const match = await this.matchService.getMatchById(matchId);
    if (!match) {
      throw new HttpException('Match with such id does not exists', 400);
    }
    await this.matchService.updateDate(matchId, newDate);
  }

  @Get('all')
  async getAllMatches(
    @Query('limit', ToNumberPipe) limit = 9,
    @Query('offset', ToNumberPipe) offset = 0,
  ) {
    return this.matchService.getAllMatches(limit, offset);
  }

  @Get(':date')
  async getMatchByDate(@Param('date') date: string) {
    return this.matchService.getMatchByDate(date);
  }

  @Post(':matchId/winner/:winnerId')
  async setWinner(
    @Param('matchId', ValidateMongooseIdPipe) matchId: ObjectId,
    @Param('winnerId', ValidateMongooseIdPipe) winnerId: ObjectId,
  ) {
    const match = await this.matchService.getMatchById(matchId);
    if (!match) {
      throw new HttpException('Match with such id does not exists', 400);
    }
    const res = await this.matchService.setWinner(matchId, winnerId);
    if (res) {
      return {
        res: 'Winner set successfully',
      };
    } else {
      return {
        res: 'Something went wrong',
      };
    }
  }
}
