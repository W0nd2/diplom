import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamDocument = Team & Document;
@Schema()
export class Team implements ITeam {
  @Prop({ required: true, unique: true })
  name: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

export interface ITeam {
  name: string;
}
