import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.isAuthenticated()) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
