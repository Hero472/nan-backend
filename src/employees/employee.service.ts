
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeeRepository.create(createEmployeeDto);
    return this.employeeRepository.save(employee);
  }

  findAllEmployees() {
    return this.employeeRepository.find();
  }

  findEmployeeById(id: number) {
    return this.employeeRepository.findOne(id);
  }

  updateEmployee(id: number, updateEmployeeDto: any) {
    return this.employeeRepository.update(id, updateEmployeeDto);
  }

  deleteEmployee(id: number) {
    return this.employeeRepository.delete(id);
  }
}
