import { TestBed } from '@angular/core/testing';

import { GetrecentusersService } from './getrecentusers.service';

describe('GetrecentusersService', () => {
  let service: GetrecentusersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetrecentusersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
