import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { Team } from './team.schema';
import { Player } from '../../player/schemas/player.schema';

export type TeamMemberDocument = TeamMember & Document;
@Schema()
export class TeamMember implements ITeamMember {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Team.name })
  teamId: ObjectId;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Player.name })
  playerId: ObjectId;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);

export interface ITeamMember {
  teamId: ObjectId;
  playerId: ObjectId;
}
