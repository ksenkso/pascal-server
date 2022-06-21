import { Document, Model } from 'mongoose';
import { RelationOptions } from '../group/group.service';

export abstract class BasicService<D extends Document, Create, Update> {
  protected constructor(protected model: Model<D>) {
  }

  create(createGroupDto: Create): Promise<D> {
    return this.model.create(createGroupDto);
  }

  findAll(options?: RelationOptions): Promise<D[]> {
    const query = this.model.find();

    this.populate(query, options);

    return query.exec();
  }

  findOne(id: string, options?: RelationOptions): Promise<D> {
    const query = this.model.findById(id);

    this.populate(query, options);

    return query.exec();
  }

  async update(id: string, updateDto: Update) {
    return this.model.findById(id).update(updateDto).exec();
  }

  async remove(id: string): Promise<void> {
    await this.model.findById(id).deleteOne().exec();
  }

  protected populate(query: any, options?: RelationOptions) {
    if (options?.relations) {
      query.populate(options.relations);
    }
  }
}
