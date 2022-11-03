import { TestBed } from '@angular/core/testing';

import { PermitGuard } from './permit.guard';

describe('PermitGuard', () => {
  let guard: PermitGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PermitGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
