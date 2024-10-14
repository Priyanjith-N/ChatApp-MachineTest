import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authPageAcessGuard } from './auth-page-acess.guard';

describe('authPageAcessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authPageAcessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
