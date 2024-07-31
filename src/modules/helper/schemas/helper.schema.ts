import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema , HydratedDocument} from 'mongoose';
export type HelperDocument = HydratedDocument<Helper>;

@Schema()
export class Helper extends Document {
    @Prop({ type: String })
    bio?: string;

    @Prop({ type: String })
    title?: string;

    @Prop({ type: Number, default: 0 })
    points?: number;

    @Prop({ type: Number, default: 0 })
    profileComplete?: number;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Area' }] })
    areas?: string[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Job' }] })
    jobs?: string[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Specialtie' }] })
    specials?: string[];

    @Prop({ type: Number })
    latitude?: number;

    @Prop({ type: Number })
    longitude?: number;

    @Prop({ type: Number })
    altitude?: number;

    @Prop({ type: Number })
    precision?: number;

    @Prop({ type: Number })
    altitudePrecision?: number;

    @Prop({ type: Number })
    header?: number;

    @Prop({ type: Number })
    speed?: number;

    @Prop({ type: Date, default: Date.now })
    creationDate?: Date;

    @Prop({ type: Date, default: Date.now })
    updateDate?: Date;

    @Prop({ type: Boolean, default: true })
    active?: boolean;
}

export const HelperSchema = SchemaFactory.createForClass(Helper);