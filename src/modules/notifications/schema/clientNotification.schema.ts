/*
    Estas notificaciones son las que recibe del helper es una copia exacta de las notificaciones del helper
    pero con la diferencia que estas notificaciones son las que se le envian a los clientes.
    y el cliente puede marca como leido o no leido.
*/

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, HydratedDocument } from 'mongoose';

export type ClientNotificationDocument =
  HydratedDocument<ClientNotification>;

@Schema()
export class ClientNotification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Helper', required: true })
  helper: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'HelperNotification',
    required: true,
  })
  helperNotification: MongooseSchema.Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Area' }] })
  areas?: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Job' }] })
  jobs?: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Specialtie' }] })
  specials?: string[];

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Date, default: Date.now })
  creationDate: Date;

  @Prop({ type: Date, default: Date.now })
  updateDate: Date;

  @Prop({ default: true })
  active: boolean;
}

export const ClientNotificationSchema = SchemaFactory.createForClass(
  ClientNotification,
);
