"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksRepository = void 0;
const typeorm_1 = require("typeorm");
const task_status_enum_1 = require("./task-status.enum");
const task_entity_1 = require("./task.entity");
let TasksRepository = class TasksRepository extends typeorm_1.Repository {
    async getTasks(filterDto, user) {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where({ user });
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%` });
        }
        const tasks = await query.getMany();
        return tasks;
    }
    async createTask(createTaskDto, user) {
        const { title, description } = createTaskDto;
        const task = this.create({
            title,
            description,
            status: task_status_enum_1.TaskStatus.OPEN,
            user,
        });
        await this.save(task);
        return task;
    }
};
TasksRepository = __decorate([
    (0, typeorm_1.EntityRepository)(task_entity_1.Task)
], TasksRepository);
exports.TasksRepository = TasksRepository;
//# sourceMappingURL=tasks.repository.js.map