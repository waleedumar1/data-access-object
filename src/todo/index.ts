import { TodoController } from './todo.controller';


export async function main() {
  const app = new TodoController();
  await app.start();
  return app;
}
