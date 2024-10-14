import { TestBed } from '@angular/core/testing';

import { UserProfileManagementService } from './user-profile-management.service';

describe('UserProfileManagementService', () => {
  let service: UserProfileManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfileManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
