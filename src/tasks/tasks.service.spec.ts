import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';

const mockTasksRepository = () => ({
  getTasks: jest.fn(), // 後にテストコードで振る舞いを記述するためjest.fn()を利用
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
  let tasksRepository: TasksRepository;

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
  });
});
