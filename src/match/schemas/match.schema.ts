import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;
@Schema()
export class Match implements IMatch {
  @Prop({ required: true })
  firstTeam: string;

  @Prop({ required: true })
  secondTeam: string;

  @Prop()
  won: string;

  @Prop({ required: true })
  startDate: Date;
}

export const MatchSchema = SchemaFactory.createForClass(Match);

export interface IMatch {
  firstTeam: string;
  secondTeam: string;
  won: string;
  startDate: Date;
}
