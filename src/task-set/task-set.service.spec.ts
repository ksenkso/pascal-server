import { Test, TestingModule } from '@nestjs/testing';
import { TaskSetService } from './task-set.service';

describe('TaskSetService', () => {
  let service: TaskSetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskSetService],
    }).compile();

    service = module.get<TaskSetService>(TaskSetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
