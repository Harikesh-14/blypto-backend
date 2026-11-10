import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    immutable: true,
  })
  clerkId!: string;

  @Prop({ type: String, trim: true, default: null })
  firstName!: string | null;

  @Prop({ type: String, trim: true, default: null })
  lastName!: string | null;

  @Prop({
    type: String,
    lowercase: true,
    trim: true,
    default: null,
  })
  email!: string | null;

  @Prop({ type: String, trim: true, default: null })
  username!: string | null;

  @Prop({ type: String, default: null })
  imageUrl!: string | null;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Prop({ type: Date, default: null })
  lastSyncedAt!: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);