import { verifyToken } from '@clerk/backend';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkService {
  constructor(
    private readonly configService: ConfigService,
  ) { }

  async verifyClerkToken(token: string) {
    return verifyToken(token, {
      secretKey: this.configService.getOrThrow<string>(
        'CLERK_SECRET_KEY',
      ),
    });
  }
}
