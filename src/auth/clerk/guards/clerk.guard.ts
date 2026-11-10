import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClerkService } from '../clerk.service.js';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    private readonly clerkService: ClerkService,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing authentication token',
      );
    }

    const token = authHeader.substring(7);

    try {
      const payload =
        await this.clerkService.verifyClerkToken(token);

      if (!payload.sub) {
        throw new UnauthorizedException(
          'Invalid authentication token',
        );
      }

      request.auth = {
        clerkId: payload.sub,
      };

      return true;
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired authentication token',
      );
    }
  }
}