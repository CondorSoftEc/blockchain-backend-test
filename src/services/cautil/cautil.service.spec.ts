import { Test, TestingModule } from '@nestjs/testing';
import { CautilService } from './cautil.service';

describe('CautilService', () => {
  let service: CautilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CautilService],
    }).compile();

    service = module.get<CautilService>(CautilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
