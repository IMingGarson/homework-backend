import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/index';
import { Employee } from './employee.entity';
import { User } from '../auth/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { hash } from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return await this.employeesRepository.find({
      relations: ['user'],
      withDeleted: true,
    });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: ['user'],
      withDeleted: true,
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createEmployeeDto.email },
      withDeleted: true,
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = this.usersRepository.create({
      email: createEmployeeDto.email,
      password: createEmployeeDto.password,
      role: createEmployeeDto.role,
    });
    await this.usersRepository.save(user);

    const employee = this.employeesRepository.create({
      name: createEmployeeDto.name,
      email: createEmployeeDto.email,
      user: user,
    });

    return this.employeesRepository.save(employee);
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);
    if (updateEmployeeDto.name) {
      employee.name = updateEmployeeDto.name;
    }

    if (updateEmployeeDto.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateEmployeeDto.email },
        withDeleted: true,
      });
      if (existingUser && existingUser.id !== employee.user.id) {
        throw new ConflictException('Email already in use');
      }
      employee.user.email = updateEmployeeDto.email;
    }

    if (updateEmployeeDto.password) {
      employee.user.password = await hash(updateEmployeeDto.password, 10);
    }

    if (updateEmployeeDto.role) {
      employee.user.role = updateEmployeeDto.role;
    }

    await this.usersRepository.save(employee.user);
    return this.employeesRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    employee.deletedAt = new Date();
    await this.employeesRepository.save(employee);
    const user = employee.user;
    user.deletedAt = new Date();
    await this.usersRepository.save(user);
  }
}
