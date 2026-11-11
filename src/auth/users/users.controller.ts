import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../clerk/guards/clerk.guard.js';
import { CurrentUser } from '../clerk/decorators/current-user.decorator.js';
import { UsersService } from './users.service.js';
import { ClerkService } from '../clerk/clerk.service.js';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly clerkService: ClerkService
  ) { }

  async syncUser(@CurrentUser() auth: { clerkId: string }) {
    // Fetch the authenticated user from the clerk
    const clerkUser = await this.clerkService.getClerkUser(auth.clerkId);

    // Find user's primary email
    const primaryEmail = clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId,
    );

    // Create or update the user in MongoDB.
    const user = await this.userService.upsertFromClerk({
      clerkId: clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      email: primaryEmail?.emailAddress ?? null,
      username: clerkUser.username,
      imageUrl: clerkUser.imageUrl,
    });

    // Returning the safe response
    return {
      success: true,
      message: 'User synchronized successfully',
      user: {
        id: user._id.toString(),
        clerkId: user.clerkId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        imageUrl: user.imageUrl,
        role: user.role,
      },
    };
  }
}