import { Test, TestingModule } from '@nestjs/testing';
import { TaskSetController } from './task-set.controller';
import { TaskSetService } from './task-set.service';

describe('TaskSetController', () => {
  let controller: TaskSetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskSetController],
      providers: [TaskSetService],
    }).compile();

    controller = module.get<TaskSetController>(TaskSetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
