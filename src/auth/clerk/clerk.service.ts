import { createClerkClient, verifyToken } from '@clerk/backend';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkService {
  private readonly clerkClient;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.clerkClient = createClerkClient({
      secretKey: this.configService.getOrThrow<string>('CLERK_SECRET_KEY')
    })
  }

  async verifyClerkToken(token: string) {
    return verifyToken(token, {
      secretKey: this.configService.getOrThrow<string>(
        'CLERK_SECRET_KEY',
      ),
    });
  }

  async getClerkUser(clerkId: string) {
    return this.clerkClient.users.getUser(clerkId);
  }
}
