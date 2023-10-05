import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { Model } from "mongoose";

import { ICompany } from '../interface/company.interface';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { StatusEnum } from '../enums/status.enum';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(@InjectModel('Company') private companyModel:Model<ICompany>) {}

  async upsertBulk(
    createCompanyDtos: CreateCompanyDto[],
  ): Promise<any> {

    let newData = createCompanyDtos.map((createCompanyDto: CreateCompanyDto) => {
      return {
        updateOne: {
          filter: {
            name: createCompanyDto.name
          },
          update: createCompanyDto,
          upsert: true,
        },
      }
    });

    const data = await this.companyModel.bulkWrite(newData);

    return data;
  }

  async create(
    correlationId: string,
    createCompanyDto: CreateCompanyDto,
  ): Promise<ICompany> {
    const data = await new this.companyModel(createCompanyDto);
    this.logger.log(JSON.stringify({ correlationId, data }));

    return data.save();
  }

  async update(
    correlationId: string,
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<ICompany> {
    const data = await this.companyModel.findByIdAndUpdate(id, updateCompanyDto, { new: true });
    this.logger.log(JSON.stringify({ correlationId, data }));

    if (!data) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return data;
  }

  async getAll(correlationId: string): Promise<ICompany[]> {
    const data = await this.companyModel.find({ status: StatusEnum.approved }).limit(50);
    this.logger.log(JSON.stringify({ correlationId, data: data.length }));

    if (!data || data.length == 0) {
        throw new NotFoundException('Companies data not found!');
    }

    return data;
  }

  async search(
    { correlationId, name }: { correlationId: string, name: string },
  ): Promise<ICompany[]> {
    const term = name.toLowerCase().split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join (' ');
    const data = await this.companyModel.find({ name: { $regex: term, $options: 'i' }, status: StatusEnum.approved }).limit(20);
    this.logger.log(JSON.stringify({ correlationId, data }));

    if (!data || data.length == 0) {
        throw new NotFoundException('Companies data not found!');
    }

    return data;
  }

  async get(correlationId: string, id: string): Promise<ICompany> {
    const data = await this.companyModel.findById(id).exec();
    this.logger.log(JSON.stringify({ correlationId, data }));

    if (!data) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return data;
  }

  async delete(id: string): Promise<ICompany> {
    const data = await this.companyModel.findByIdAndDelete(id);
    if (!data) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return data;
  }
}
