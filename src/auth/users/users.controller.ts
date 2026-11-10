import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../clerk/guards/clerk.guard.js';
import { CurrentUser } from '../clerk/decorators/current-user.decorator.js';

@Controller('users')
export class UsersController {
  @Get('test')
  @UseGuards(ClerkAuthGuard)
  test(@CurrentUser() user: { clerkId: string }) {
    return {
      message: 'Authentication successful!',
      clerkId: user.clerkId,
    };
  }
}