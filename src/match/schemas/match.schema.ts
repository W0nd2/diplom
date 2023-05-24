import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type MatchDocument = Match & Document;
@Schema()
export class Match implements IMatch {
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  firstTeam: ObjectId;

  @Prop({ required: true, type: SchemaTypes.ObjectId })
  secondTeam: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  winner: ObjectId;

  @Prop({ required: true })
  startDate: Date;
}

export const MatchSchema = SchemaFactory.createForClass(Match);

export interface IMatch {
  firstTeam: ObjectId;
  secondTeam: ObjectId;
  winner: ObjectId;
  startDate: Date;
}
