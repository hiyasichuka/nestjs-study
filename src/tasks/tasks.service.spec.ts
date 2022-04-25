import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(), // 後にテストコードで振る舞いを記述するためjest.fn()を利用
  findOne: jest.fn(),
});

// リポジトリの引数に必要となるユーザデータクラスのダミーデータ
const mockUser = {
  username: 'someone',
  id: 'test_id',
  password: 'test_password',
  tasks: [],
};

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // テストモジュールを作成する。
    // サービスクラスに対して、リポジトリのモックを注入する
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile(); // テストモジュールからサービスクラスを受け取る

    tasksService = module.get(TasksService);

    // テストモジュールからリポジトリクラスを受け取る
    tasksRepository = module.get(TasksRepository);
  }); // サービスクラスのgetTasksの呼び出しをテストする

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks', () => {
      // まだ１度も呼ばれていないことをテスト
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      // ダミーデータを渡してサービスクラスの処理を呼び出す
      tasksService.getTasks(null, mockUser);
      // 呼び出されたことをテスト
      expect(tasksRepository.getTasks).toHaveBeenCalled();
    });

    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      // resultの中身が一致していることをテスト
      expect(result).toEqual('someValue');
      // resultの中身が一致していないことをテスト
      expect(result).not.toEqual('otherValue');
    });
  });
});
