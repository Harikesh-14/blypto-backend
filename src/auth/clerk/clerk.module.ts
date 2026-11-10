import { Module } from '@nestjs/common';
import { ClerkService } from './clerk.service.js';
import { ClerkAuthGuard } from './guards/clerk.guard.js';

@Module({
  providers: [
    ClerkService,
    ClerkAuthGuard
  ],
  exports: [
    ClerkService,
    ClerkAuthGuard
  ]
})
export class ClerkModule { }
