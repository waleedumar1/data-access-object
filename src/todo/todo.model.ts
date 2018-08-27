// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import { Entity } from '../../packages/model';


export class Todo extends Entity {

	id?: number;

	title: string;

	desc?: string;

	isComplete?: boolean;

	remindAtAddress?: string; // address,city,zipcode

	remindAtGeo?: string; // latitude,longitude

	constructor(data?: Partial<Todo>) {
		super(data);
	}
}
