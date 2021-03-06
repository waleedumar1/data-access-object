import { AnyObject, Class, Command, DataObject, NamedParameters, Options, PositionalParameters } from '../common-types';
import { Entity, Model, ValueObject } from '../model';

export interface Repository<T extends Model> { }
export interface ExecutableRepository<T extends Model> extends Repository<T> {
  /**
   * Execute a query with the given parameter object or an array of parameters
   * @param command The query string or command object
   * @param parameters The object with name/value pairs or an array of parameter
   * values
   * @param options Options
   */
  execute(
    command: Command,
    parameters: NamedParameters | PositionalParameters,
    options?: Options,
  ): Promise<AnyObject>;
}

export interface EntityRepository<T extends Entity, ID>
  extends ExecutableRepository<T> { }

export interface EntityCrudRepository<T extends Entity, ID>
  extends EntityRepository<T, ID>,
  CrudRepository<T> {
  /**
   * Save an entity. If no id is present, create a new entity
   * @param entity Entity to be saved
   * @param options Options for the operations
   * @returns A promise of an entity saved or null if the entity does not exist
   */
  save(entity: DataObject<T>, options?: Options): Promise<T | null>;

  // /**
  //  * Update an entitya
  //  * @param entity Entity to be updated
  //  * @param options Options for the operations
  //  * @returns Promise<true> if the entity is updated, otherwise
  //  * Promise<false>
  //  */
  // update(entity: DataObject<T>, options?: Options): Promise<boolean>;

  // /**
  //  * Delete an entity
  //  * @param entity Entity to be deleted
  //  * @param options Options for the operations
  //  * @returns Promise<true> if the entity is deleted, otherwise
  //  * Promise<false>
  //  */
  // delete(entity: DataObject<T>, options?: Options): Promise<boolean>;

  // /**
  //  * Find an entity by id
  //  * @param id Value for the entity id
  //  * @param options Options for the operations
  //  * @returns A promise of an entity found for the id
  //  */
  // findById(id: ID, filter?: Filter, options?: Options): Promise<T>;

  // /**
  //  * Update an entity by id with property/value pairs in the data object
  //  * @param data Data attributes to be updated
  //  * @param id Value for the entity id
  //  * @param options Options for the operations
  //  * @returns Promise<true> if the entity is updated, otherwise
  //  * Promise<false>
  //  */
  // updateById(id: ID, data: DataObject<T>, options?: Options): Promise<boolean>;

  // /**
  //  * Replace an entity by id
  //  * @param data Data attributes to be replaced
  //  * @param id Value for the entity id
  //  * @param options Options for the operations
  //  * @returns Promise<true> if an entity is replaced, otherwise
  //  * Promise<false>
  //  */
  // replaceById(id: ID, data: DataObject<T>, options?: Options): Promise<boolean>;

  // /**
  //  * Delete an entity by id
  //  * @param id Value for the entity id
  //  * @param options Options for the operations
  //  * @returns Promise<true> if an entity is deleted for the id, otherwise
  //  * Promise<false>
  //  */
  // deleteById(id: ID, options?: Options): Promise<boolean>;

  // /**
  //  * Check if an entity exists for the given id
  //  * @param id Value for the entity id
  //  * @param options Options for the operations
  //  * @returns Promise<true> if an entity exists for the id, otherwise
  //  * Promise<false>
  //  */
  // exists(id: ID, options?: Options): Promise<boolean>;
}

export interface CrudRepository<T extends ValueObject | Entity>
  extends Repository<T> {
  /**
   * Create a new record
   * @param dataObject The data to be created
   * @param options Options for the operations
   * @returns A promise of record created
   */
  create(dataObject: DataObject<T>, options?: Options): Promise<T>;

  /**
   * Create all records
   * @param dataObjects An array of data to be created
   * @param options Options for the operations
   * @returns A promise of an array of records created
   */
  createAll(dataObjects: DataObject<T>[], options?: Options): Promise<T[]>;

  /**
   * Find matching records
   * @param filter Query filter
   * @param options Options for the operations
   * @returns A promise of an array of records found
   */
  // find(filter?: Filter, options?: Options): Promise<T[]>;

  // /**
  //  * Updating matching records with attributes from the data object
  //  * @param dataObject The data to be updated
  //  * @param where Matching criteria
  //  * @param options Options for the operations
  //  * @returns A promise of number of records updated
  //  */
  // updateAll(
  //   dataObject: DataObject<T>,
  //   where?: Where,
  //   options?: Options,
  // ): Promise<number>;

  // /**
  //  * Delete matching records
  //  * @param where Matching criteria
  //  * @param options Options for the operations
  //  * @returns A promise of number of records deleted
  //  */
  // deleteAll(where?: Where, options?: Options): Promise<number>;

  // /**
  //  * Count matching records
  //  * @param where Matching criteria
  //  * @param options Options for the operations
  //  * @returns A promise of number of records matched
  //  */
  // count(where?: Where, options?: Options): Promise<number>;
}
