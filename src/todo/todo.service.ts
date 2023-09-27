import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Todo } from './todo.entity'
import { User } from '../user/user.entity'

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async createTodo(title: string, user: User): Promise<Todo> {
    const todo = new Todo()
    todo.title = title
    todo.user = user
    await this.todoRepository.save(todo)
    delete todo.user // Remove user data from the returned todo
    return todo
  }

  async getTodos(user: User): Promise<Todo[]> {
    return this.todoRepository.find({ where: { userId: user.id } })
  }

  async getTodoById(id: number, user: User): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id, userId: user.id },
    })
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }
    return todo
  }

  async updateTodo(id: number, title: string, user: User): Promise<Todo> {
    const todo = await this.getTodoById(id, user)
    todo.title = title
    await this.todoRepository.save(todo)
    return todo
  }

  async deleteTodo(id: number, user: User): Promise<void> {
    const result = await this.todoRepository.delete({ id, userId: user.id })
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }
  }
}
