import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { Role } from './role.schema';

export type PlayerDocument = Player & Document;
@Schema()
export class Player implements IPlayer {
  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Role.name })
  roleId: ObjectId;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

export interface IPlayer {
  nickname: string;
  email: string;
  password: string;
}
