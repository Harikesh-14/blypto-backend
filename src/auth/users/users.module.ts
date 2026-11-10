import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { ClerkService } from '../clerk/clerk.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ])
  ],
  providers: [UsersService, ClerkService],
  exports: [UsersService, ClerkService],
  controllers: [UsersController]
})
export class UsersModule {}
