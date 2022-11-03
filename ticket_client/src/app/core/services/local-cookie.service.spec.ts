import { TestBed } from '@angular/core/testing';

import { LocalCookieService } from './local-cookie.service';

describe('LocalCookieService', () => {
  let service: LocalCookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalCookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
