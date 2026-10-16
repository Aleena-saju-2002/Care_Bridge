import { Model } from "mongoose";

class BaseRepository<T> {
  protected model: Model<unknown>;

  constructor(model: Model<unknown>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).lean<T>();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().lean<T[]>();
  }

  async deleteById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}

export default BaseRepository;