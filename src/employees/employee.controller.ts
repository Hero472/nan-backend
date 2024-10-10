
import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.createEmployee(createEmployeeDto);
  }

  @Get()
  findAllEmployees() {
    return this.employeeService.findAllEmployees();
  }

  @Get(':id')
  findEmployeeById(@Param('id') id: number) {
    return this.employeeService.findEmployeeById(id);
  }

  @Patch(':id')
  updateEmployee(@Param('id') id: number, @Body() updateEmployeeDto: any) {
    return this.employeeService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete(':id')
  deleteEmployee(@Param('id') id: number) {
    return this.employeeService.deleteEmployee(id);
  }
}
