import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema , HydratedDocument} from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
    customer: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Helper'})
    helper: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    city: string;

    @Prop({ type: Date, default: Date.now })
    creationDate: Date;

    @Prop({ type: Date, default: Date.now, update: true })
    updateDate: Date;

    @Prop({ type: Boolean, default: true })
    active: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);