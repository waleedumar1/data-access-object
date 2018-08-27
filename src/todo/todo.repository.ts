import { DefaultCrudRepository, juggler } from '../../packages/repositories/defaultCrudRepo';
import { Todo } from './todo.model';

export class TodoRepository extends DefaultCrudRepository<
  Todo,
  typeof Todo.prototype.id
> {
  constructor(
    
  ) {
    super(Todo, null);
  }
}