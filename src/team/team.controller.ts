import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query, UseGuards
} from "@nestjs/common";
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { ToNumberPipe } from '../pipes/to-number.pipe';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ObjectId } from 'mongoose';
import { ValidateMongooseIdPipe } from '../pipes/validate-mongoose-id.pipe';
import { IPlayerPublicService } from '../player-public-contract/player.public.service.interface';
import { ModuleRef } from '@nestjs/core';
import { IsLogedInGuard } from "../guards/is-loged-in.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleType } from "../player/types/role.type";
import { RolesGuard } from "../guards/roles.guard";

@Controller('team')
export class TeamController {
  private playerPublicService: IPlayerPublicService;
  constructor(
    private moduleRef: ModuleRef,
    private readonly teamRepository: TeamRepository,
    private readonly teamService: TeamService,
  ) {}

  async onModuleInit() {
    this.playerPublicService = await this.moduleRef.resolve(
      'IPlayerPublicService',
    );
  }
  @Roles([RoleType.Admin])
  @UseGuards(RolesGuard)
  @Post('/create')
  async createTeam(@Body() dto: CreateTeamDto) {
    const team = await this.teamService.getTeamByName(dto.name);
    if (team) {
      throw new HttpException('This team is already exists', 400);
    }
    const newTeam = await this.teamService.createTeam(dto);
    return { message: `Team with name ${newTeam.name} was created success` };
  }

  @Get()
  async getAllTeams(
    @Query('limit', ToNumberPipe) limitQ = 9,
    @Query('offset', ToNumberPipe) offsetQ = 0,
  ) {
    return this.teamService.getAllTeams(limitQ, offsetQ);
  }
  @Roles([RoleType.Admin])
  @UseGuards(RolesGuard)
  @Delete(':teamId')
  async deleteTeam(@Param('teamId', ValidateMongooseIdPipe) teamId: ObjectId) {
    if (!teamId) {
      throw new HttpException('Incorrect teamId', 400);
    }
    const team = await this.teamService.getTeamById(teamId);
    if (!team) {
      throw new HttpException('Team with such id does not exists', 400);
    }
    await this.teamService.deleteTeam(teamId);
    return {
      message: `Team with this id ${teamId} was deleted successfully`,
    };
  }
  @Roles([RoleType.Admin])
  @UseGuards(RolesGuard)
  @Put(':teamId')
  async updateTeam(
    @Param('teamId', ValidateMongooseIdPipe) teamId: ObjectId,
    @Body() dto: UpdateTeamDto,
  ) {
    if (!teamId) {
      throw new HttpException('Incorrect teamId', 400);
    }
    const team = await this.teamService.getTeamById(teamId);
    if (!team) {
      throw new HttpException('Team with such id does not exists', 400);
    }
    await this.teamService.updateTeam(teamId, dto);
    return {
      message: `Team name ${team.name} was changed to ${dto.name} successfully`,
    };
  }

  @Get(':teamId')
  async getTeamInfo(@Param('teamId', ValidateMongooseIdPipe) teamId: string) {
    return this.teamService.getTeamInfo(teamId);
  }
  @UseGuards(IsLogedInGuard)
  @Post('/member/add/:playerId/:teamId')
  async addMemberToTeam(
    @Param('playerId', ValidateMongooseIdPipe) playerId: ObjectId,
    @Param('teamId', ValidateMongooseIdPipe) teamId: ObjectId | string,
  ) {
    console.log(teamId);
    if (!playerId || !teamId) {
      throw new HttpException('Incorrect playerId or teamId', 400);
    }
    const player = await this.playerPublicService.getPlayerById(playerId);
    if (!player) {
      throw new HttpException('Player with such id does not exists', 400);
    }
    const team = await this.teamService.getTeamById(teamId);
    if (!team) {
      throw new HttpException('Team with such id does not exists', 400);
    }
    const userAlreadyOnTeam = await this.teamService.userOnTeam(playerId);
    if (userAlreadyOnTeam.length) {
      throw new HttpException('Player already on a team', 400);
    }
    const membersOnTeam = await this.teamService.getTeamInfo(team.id);
    const fullTeam = 5;
    if (membersOnTeam.total === fullTeam) {
      throw new HttpException('This team is already full', 400);
    }
    await this.teamService.addPlayerToTeam(teamId, playerId);
    return {
      message: `Player added successfully`,
    };
  }
  @Roles([RoleType.Admin])
  @UseGuards(RolesGuard)
  @Delete('/member/delete/:playerId/:teamId')
  async deleteMemberFromTeam(
    @Param('playerId', ValidateMongooseIdPipe) playerId: ObjectId,
    @Param('teamId', ValidateMongooseIdPipe) teamId: ObjectId,
  ) {
    if (!playerId || !teamId) {
      throw new HttpException('Incorrect playerId or teamId', 400);
    }
    const player = await this.playerPublicService.getPlayerById(playerId);
    if (!player) {
      throw new HttpException('Player with such id does not exists', 400);
    }
    const team = await this.teamService.getTeamById(teamId);
    if (!team) {
      throw new HttpException('Team with such id does not exists', 400);
    }
    const userOnTeam = await this.teamService.userOnTeam(playerId);
    if (!userOnTeam.length) {
      throw new HttpException('Player not on a team', 400);
    }
    await this.teamService.deleteMemberFromTeam(teamId, playerId);
    return {
      message: `Player deleted successfully`,
    };
  }
}
