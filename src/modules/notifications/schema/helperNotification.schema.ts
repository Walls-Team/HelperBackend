import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, HydratedDocument } from 'mongoose';

export type HelperNotificationDocument = HydratedDocument<HelperNotification>;

@Schema()
export class HelperNotification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Helper', required: true })
  owner: MongooseSchema.Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Area' }] })
  areas?: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Job' }] })
  jobs?: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Specialtie' }] })
  specials?: string[];

  @Prop({ default: 500 })
  radio: number;

  @Prop({ default: 0 })
  clientsNotified: number;

  @Prop({ default: 0 })
  clientsRead: number;

  @Prop({ type: Date, default: Date.now })
  creationDate: Date;

  @Prop({ type: Date, default: Date.now })
  updateDate: Date;

  @Prop({ default: true })
  active: boolean;
}

export const HelperNotificationSchema = SchemaFactory.createForClass(HelperNotification);
