import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Schema } from 'mongoose';
import { Role } from '../auth/role.enum';
import { Group } from './group.schema';

@NestSchema()
export class User {
  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop({
    type: Schema.Types.String,
  })
  password: string;

  @Prop({ type: [Schema.Types.String], default: [] })
  roles: Role[];

  @Prop({
    type: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    default: [],
  })
  groups: Group[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods.setPassword = function (password: string) {
  const salt = bcrypt.genSaltSync(10);

  this.password = bcrypt.hashSync(password, salt);
}
export type UserDocument = User & Document & {
  setPassword(password: string): void;
};
