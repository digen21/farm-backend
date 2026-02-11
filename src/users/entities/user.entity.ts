import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export class Address {
  @Prop() country: string;
  @Prop() state: string;
  @Prop() city: string;
  @Prop() area: string;
  @Prop({
    minlength: 6,
    maxlength: 6,
    match: /^[0-9]{6}$/,
  })
  pincode: string;
}

export enum UserRole {
  SELLER = 'SELLER',
  BUYER = 'BUYER',
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, required: true }) mobile: string;
  @Prop() name: string;
  @Prop({ enum: UserRole, default: UserRole.BUYER }) role: string;
  @Prop({ default: false }) isVerified: boolean;
  @Prop({ type: Address }) address: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);
