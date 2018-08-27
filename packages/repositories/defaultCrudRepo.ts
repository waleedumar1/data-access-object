import { isPromiseLike } from '@loopback/context';
import * as assert from 'assert';
import * as legacy from 'loopback-datasource-juggler';

import { AnyObject, Command, DataObject, NamedParameters, Options, PositionalParameters } from '../common-types';
import { Entity, ModelDefinition } from '../model';
import { EntityCrudRepository } from './entCrudRepo';

// need the import for exporting of a return type
// tslint:disable-next-line:no-unused-variable
export namespace juggler {
	export import DataSource = legacy.DataSource;
	export import ModelBase = legacy.ModelBase;
	export import ModelBaseClass = legacy.ModelBaseClass;
	export import PersistedModel = legacy.PersistedModel;
	export import KeyValueModel = legacy.KeyValueModel;
	export import PersistedModelClass = legacy.PersistedModelClass;
}

export function ensurePromise<T>(p: legacy.PromiseOrVoid<T>): Promise<T> {
	if (p && isPromiseLike(p)) {
		// Juggler uses promise-like Bluebird instead of native Promise
		// implementation. We need to convert the promise returned by juggler
		// methods to proper native Promise instance.
		return Promise.resolve(p);
	} else {
		return Promise.reject(new Error('The value should be a Promise: ' + p));
	}
}

/**
 * Default implementation of CRUD repository using legacy juggler model
 * and data source
 */
export class DefaultCrudRepository<T extends Entity, ID>
	implements EntityCrudRepository<T, ID> {
	modelClass: juggler.PersistedModelClass;

	/**
	 * Constructor of DefaultCrudRepository
	 * @param modelClass Legacy model class
	 * @param dataSource Legacy data source
	 */
	constructor(
		// entityClass should have type "typeof T", but that's not supported by TSC
		public entityClass: typeof Entity & { prototype: T },
		public dataSource: juggler.DataSource,
	) {
		const definition = entityClass.definition;
		assert(
			!!definition,
			`Entity ${entityClass.name} must have valid model definition.`,
		);

		assert(
			definition.idProperties().length > 0,
			`Entity ${entityClass.name} must have at least one id/pk property.`,
		);

		this.setupPersistedModel(definition);
	}

	// Create an internal legacy Model attached to the datasource
	private setupPersistedModel(definition: ModelDefinition) {
		const dataSource = this.dataSource;

		const model = dataSource.getModel(definition.name);
		if (model) {
			// The backing persisted model has been already defined.
			this.modelClass = model as typeof juggler.PersistedModel;
			return;
		}

		// We need to convert property definitions from PropertyDefinition
		// to plain data object because of a juggler limitation
		const properties: { [name: string]: object } = {};

		// We need to convert PropertyDefinition into the definition that
		// the juggler understands

		//Comment By Waleed

		// Object.entries(definition.properties).forEach(([key, value]) => {
		// 	if (value.type === 'array' || value.type === Array) {
		// 		value = Object.assign({}, value, { type: [value.itemType] });
		// 		delete value.itemType;
		// 	}
		// 	properties[key] = Object.assign({}, value);
		// });

		this.modelClass = dataSource.createModel<juggler.PersistedModelClass>(
			definition.name,
			properties,
			Object.assign({ strict: true }, definition.settings),
		);
		this.modelClass.attachTo(dataSource);
	}

	/**
	 * Function to create a constrained relation repository factory
	 *
	 * ```ts
	 * class CustomerRepository extends DefaultCrudRepository<
	 *   Customer,
	 *   typeof Customer.prototype.id
	 * > {
	 *   public orders: HasManyRepositoryFactory<Order, typeof Customer.prototype.id>;
	 *
	 *   constructor(
	 *     protected db: juggler.DataSource,
	 *     orderRepository: EntityCrudRepository<Order, typeof Order.prototype.id>,
	 *   ) {
	 *     super(Customer, db);
	 *     this.orders = this._createHasManyRepositoryFactoryFor(
	 *       'orders',
	 *       orderRepository,
	 *     );
	 *   }
	 * }
	 * ```
	 *
	 * @param relationName Name of the relation defined on the source model
	 * @param targetRepo Target repository instance
	 */
	//   protected _createHasManyRepositoryFactoryFor<
	//     Target extends Entity,
	//     TargetID,
	//     ForeignKeyType
	//   >(
	//     relationName: string,
	//     targetRepo: EntityCrudRepository<Target, TargetID>,
	//   ): HasManyRepositoryFactory<Target, ForeignKeyType> {
	//     const meta = this.entityClass.definition.relations[relationName];
	//     return createHasManyRepositoryFactory<Target, TargetID, ForeignKeyType>(
	//       meta as HasManyDefinition,
	//       targetRepo,
	//     );
	//   }

	async create(entity: DataObject<T>, options?: Options): Promise<T> {
		const model = await ensurePromise(this.modelClass.create(entity, options));
		return this.toEntity(model);
	}

	async createAll(entities: DataObject<T>[], options?: Options): Promise<T[]> {
		const models = await ensurePromise(
			this.modelClass.create(entities, options),
		);
		return this.toEntities(models);
	}

	save(entity: T, options?: Options): Promise<T | null> {
		const id = this.entityClass.getIdOf(entity);
		if (id == null) {
			return this.create(entity, options);
		} else {
			return this.replaceById(id, entity, options).then(
				result =>
					result ? (new this.entityClass(entity.toObject()) as T) : null,
			);
		}
	}
	replaceById(
		id: ID,
		data: DataObject<T>,
		options?: Options,
	): Promise<boolean> {
		return ensurePromise(this.modelClass.replaceById(id, data, options)).then(
			result => !!result,
		);
	}

	async execute(
		command: Command,
		// tslint:disable:no-any
		parameters: NamedParameters | PositionalParameters,
		options?: Options,
	): Promise<AnyObject> {
		/* istanbul ignore next */
		throw new Error('Not implemented');
	}

	protected toEntity(model: juggler.PersistedModel): T {
		return new this.entityClass(model.toObject()) as T;
	}

	protected toEntities(models: juggler.PersistedModel[]): T[] {
		return models.map(m => this.toEntity(m));
	}
}