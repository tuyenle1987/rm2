import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";

import { ICompany } from '../interface/company.interface';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

@Injectable()
export class CompanyService {
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
    createCompanyDto: CreateCompanyDto,
  ): Promise<ICompany> {
    const data = await new this.companyModel(createCompanyDto);
    return data.save();
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<ICompany> {
    const data = await this.companyModel.findByIdAndUpdate(id, updateCompanyDto, { new: true });
    if (!data) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return data;
  }

  async getAll(): Promise<ICompany[]> {
    const data = await this.companyModel.find();
    if (!data || data.length == 0) {
        throw new NotFoundException('Companies data not found!');
    }

    return data;
  }

  async get(id: string): Promise<ICompany> {
    const data = await this.companyModel.findById(id).exec();
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
