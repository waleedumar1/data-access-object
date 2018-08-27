// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import { del, get, param, patch, post, put, requestBody } from '@loopback/rest';
import { RestApplication, RestServer } from '@loopback/rest';

import { Todo } from './todo.model';
import { TodoRepository } from './todo.repository';

export class TodoController {
	constructor(
		//@repository(TodoRepository) 
		protected todoRepo: TodoRepository,
	) { }

async createTodo(todo: Todo) {
	// if (todo.remindAtAddress) {
	// 	// TODO(bajtos) handle "address not found"
	// 	const geo = await this.geoService.geocode(todo.remindAtAddress);
	// 	// Encode the coordinates as "lat,lng" (Google Maps API format). See also
	// 	// https://stackoverflow.com/q/7309121/69868
	// 	// https://gis.stackexchange.com/q/7379
	// 	todo.remindAtGeo = `${geo[0].y},${geo[0].x}`;
	// }

	return await this.todoRepo.create(todo);
}

// async findTodoById(
// 		@param.path.number('id') id: number,
// 		@param.query.boolean('items') items ?: boolean,
// 	): Promise < Todo > {
// 	return await this.todoRepo.findById(id);
// }

// async findTodos(): Promise < Todo[] > {
// 	return await this.todoRepo.find();
// }

// async replaceTodo(
// 		@param.path.number('id') id: number,
// 		@requestBody() todo: Todo,
// 	): Promise < boolean > {
// 	return await this.todoRepo.replaceById(id, todo);
// }

// async updateTodo(
// 		@param.path.number('id') id: number,
// 		@requestBody() todo: Todo,
// 	): Promise < boolean > {
// 	return await this.todoRepo.updateById(id, todo);
// }

// async deleteTodo(@param.path.number('id') id: number): Promise < boolean > {
// 	return await this.todoRepo.deleteById(id);
// }
}
