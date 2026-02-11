import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProjectionType,
  QueryFilter,
  QueryOptions,
  Types,
  UpdateQuery,
  type PaginateModel,
} from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

type Options = QueryOptions<User> & { projection?: ProjectionType<User> };

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: PaginateModel<User>) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findOne(query: QueryFilter<User>, options: Options = {}) {
    return this.userModel.findOne(query, options.projection, options).exec();
  }

  update(
    id: string | Types.ObjectId,
    updateUserDto: UpdateQuery<UpdateUserDto>,
    options: Options = { returnDocument: 'after' },
  ) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, options);
  }
}
