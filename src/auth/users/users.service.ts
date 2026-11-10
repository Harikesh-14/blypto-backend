import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema.js';

export interface ClerkUserData {
  clerkId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  username: string | null;
  imageUrl?: string | null;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  // Find a user using their Clerk ID
  async findByClerkId(
    clerkId: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ clerkId }).exec();
  }

  // Create or synchronize a user from Clerk
  async upsertFromClerk(
    data: ClerkUserData,
  ): Promise<UserDocument> {
    const { clerkId, ...profile } = data;

    const user = await this.userModel.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          ...profile,
          lastSyncedAt: new Date(),
        },
        $setOnInsert: {
          clerkId,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).exec();

    return user;
  }

  // Find a user by MongoDB ID
  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Delete a user using their Clerk ID
  async deleteByClerkId(clerkId: string): Promise<void> {
    const result = await this.userModel.deleteOne({
      clerkId,
    }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
