import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema , HydratedDocument} from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema()
export class Job extends Document {
  @Prop({ required: true, maxlength: 200 })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Area' }] })
  area: string[];

  @Prop({ type: Date, default: Date.now })
  creationDate: Date;

  @Prop({ type: Date, default: Date.now })
  updateDate: Date;

  @Prop({ type: Boolean, default: true })
  active: boolean;
}

export const JobSchema = SchemaFactory.createForClass(Job);
