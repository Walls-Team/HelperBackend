import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type AreaDocument = HydratedDocument<Area>;

@Schema()
export class Area extends Document {
  @Prop({ required: true, maxlength: 250 })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ default: Date.now })
  creationDate: Date;

  @Prop({ default: Date.now, type: Date })
  updateDate: Date;

  @Prop({ default: true })
  active: boolean;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
