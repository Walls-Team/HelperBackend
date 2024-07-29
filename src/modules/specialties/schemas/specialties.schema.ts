import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type SpecialtieDocument = HydratedDocument<Specialtie>;

@Schema()
export class Specialtie extends Document {
  @Prop({ required: true, maxlength: 200 })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: MongooseSchema.ObjectId, ref: 'Area' })
  area: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  creationDate: Date;

  @Prop({ type: Date, default: Date.now })
  updateDate: Date;

  @Prop({ type: Boolean, default: true })
  active: boolean;
}

export const SpecialtieSchema = SchemaFactory.createForClass(Specialtie);
