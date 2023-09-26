import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, Version } from '@nestjs/common';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post()
  @Version('1')
  async create(
    @Res() response,
    @Body() createDto: CreateCompanyDto,
  ) {
    try {
      const data = await this.service.create(createDto);

      return response.status(HttpStatus.CREATED).json({
        data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Company not created!',
        error: 'Bad Request'
      });
    }
  }

  @Put('/:id')
  @Version('1')
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() updateDto: UpdateCompanyDto,
  ) {
    try {
      const data = await this.service.update(id, updateDto);

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  @Version('1')
  async getAll(@Res() response) {
    try {
      const data = await this.service.getAll();

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  @Version('1')
  async get(
    @Res() response,
    @Param('id') id: string,
  ) {
    try {
      const data = await this.service.get(id);

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  @Version('1')
  async delete(
    @Res() response,
    @Param('id') id: string,
  ) {
    try {
      const data = await this.service.delete(id);

      return response.status(HttpStatus.OK).json({
        data,
      });
    }catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
