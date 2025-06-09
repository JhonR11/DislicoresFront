import { CanActivateFn } from '@angular/router';

export const noAUthGuard: CanActivateFn = (route, state) => {
  return true;
};
