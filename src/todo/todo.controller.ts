import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { TodoService } from './todo.service'
import { Todo } from './todo.entity'
import { GetUser } from '../auth/get-user.decorator'
import { User } from '../user/user.entity'
import { AuthGuard } from '@nestjs/passport'

@Controller('todos')
@UseGuards(AuthGuard())
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  createTodo(
    @Body('title') title: string,
    @GetUser() user: User,
  ): Promise<Todo> {
    return this.todoService.createTodo(title, user)
  }

  @Get()
  getTodos(@GetUser() user: User): Promise<Todo[]> {
    return this.todoService.getTodos(user)
  }

  @Get('/:id')
  getTodoById(@Param('id') id: number, @GetUser() user: User): Promise<Todo> {
    return this.todoService.getTodoById(id, user)
  }

  @Put('/:id')
  updateTodo(
    @Param('id') id: number,
    @Body('title') title: string,
    @GetUser() user: User,
  ): Promise<Todo> {
    return this.todoService.updateTodo(id, title, user)
  }

  @Delete('/:id')
  deleteTodo(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    return this.todoService.deleteTodo(id, user)
  }
}
