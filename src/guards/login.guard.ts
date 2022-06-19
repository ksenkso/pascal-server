import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class LoginGuard extends AuthGuard('local') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await super.canActivate(context) as boolean;
    const request = context.switchToHttp().getRequest();
    await this.logIn(request)

    return authenticated;
  }

}
