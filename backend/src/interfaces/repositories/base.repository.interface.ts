interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;

  findAll(): Promise<T[]>;

  deleteById(id: string): Promise<void>;
}

export default IBaseRepository;