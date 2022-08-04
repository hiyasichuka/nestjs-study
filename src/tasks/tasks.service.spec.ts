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
    }).compile(); 
    
    // テストモジュールからサービスクラスを受け取る
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
      // リポジトリの振る舞いを定義
      tasksRepository.getTasks.mockResolvedValue('someValue');
      // サービスクラスを呼び出す
      const result = await tasksService.getTasks(null, mockUser);
      // resultの中身が一致していることをテスト
      expect(result).toEqual('someValue');
      // resultの中身が一致していないことをテスト
      expect(result).not.toEqual('otherValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      // テスト用ダミーデータを作成
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };
      // リポジトリの振る舞いを定義
      tasksRepository.findOne.mockResolvedValue(mockTask);
      // サービスを呼び出す
      const result = await tasksService.getTaskById('someId', mockUser);
      // 想定通りの結果であることを確認
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      // リポジトリの振る舞いを定義
      tasksRepository.findOne.mockResolvedValue(null);
      // 想定の例外が発生することを確認
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
