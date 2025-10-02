export abstract class InteriorMaterialsRepository<T> {
    abstract create(item: T): Promise<T>;
    abstract findById(id: string): Promise<T | null>;
    abstract update(item: T): Promise<T>;
    abstract delete(id: string): Promise<T>;
}