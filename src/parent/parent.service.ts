import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { Parent } from './entities/parent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSend } from '../types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ParentService {

  constructor(
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>
  ) {}

  async create(createParentDto: CreateParentDto) : Promise<UserSend> {

    const {name, email, password } = createParentDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const parent = this.parentRepository.create({
      name,
      email,
      password: Buffer.from(hashedPassword)
    })

    try {
      const result = await this.parentRepository.save(parent);

      return {
        id_user: result.id_parent,
        name: result.name,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        user_type: "parent"
      };

    } catch (error: unknown) {
      throw new InternalServerErrorException('An error occurred while saving the parent');
    }
  }

  findAll() {
    return `This action returns all parent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parent`;
  }

  update(id: number, updateParentDto: UpdateParentDto) {
    return `This action updates a #${id} parent`;
  }

  remove(id: number) {
    return `This action removes a #${id} parent`;
  }
}
