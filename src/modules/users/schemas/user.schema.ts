import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document , HydratedDocument} from 'mongoose';

export type CatDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ type: String, unique: true, required: true })
    email: string;

    @Prop({ type: String, required: true, minlength: 8, maxlength: 36 })
    password: string;

    @Prop({ type: String, required: true, maxlength: 250 })
    firstName: string;

    @Prop({ type: String, required: true, maxlength: 250 })
    lastName: string;

    @Prop({ type: Date, default: Date.now })
    creationDate: Date;

    @Prop({ type: Date, default: Date.now, update: true })
    updateDate: Date;

    @Prop({ type: Boolean, default: true })
    active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);