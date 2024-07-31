import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema , HydratedDocument} from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer extends Document {
    @Prop({ required: false, maxlength: 200 , unique : true })
    businessName: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Area' }] })
    areas: string[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Job' }] })
    jobs: string[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Specialtie' }] })
    specials: string[];

    @Prop({ required: false, type: Number })
    latitude: number;

    @Prop({ required: false, type: Number })
    longitude: number;

    @Prop({ required: false, type: Number })
    altitude: number;

    @Prop({ required: false, type: Number })
    precision: number;

    @Prop({ required: false, type: Number })
    altitudePrecision: number;

    @Prop({ required: false, type: Number })
    header: number;

    @Prop({ required: false, type: Number })
    speed: number;

    @Prop({ default: Date.now })
    creationDate: Date;

    @Prop({ default: Date.now })
    updateDate: Date;

    @Prop({ default: true })
    active: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);