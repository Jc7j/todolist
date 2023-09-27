import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm'
import { User } from '../user/user.entity'

@Entity('todos')
@Unique(['todo'])
export class Todo {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  status: string

  @ManyToOne(() => User, (user) => user.todos)
  user: User

  @Column()
  userId: number
}
