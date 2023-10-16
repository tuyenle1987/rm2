import fetch from 'node-fetch';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IReviewer } from '../interface/reviewer.interface';
import { getQuery } from './history.util';

@Injectable()
export class HistoryService {
  private theorgBearer: string;
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    @InjectModel('Reviewer') private reviewerModel:Model<IReviewer>,
    private readonly configService: ConfigService,
  ) {
    this.theorgBearer = this.configService.get<string>('theorgBearer');
  }

  async getData({ correlationId, bearer, id }) {
    try {
      const response = await fetch(
        'https://api.vision.theorg.com/graphql',
        {
          method: 'POST',
          body: getQuery(id),
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': bearer,
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9,nl;q=0.8,vi;q=0.7',
            'Cache-Control': 'no-cache',
            'Content-Length': '682',
            'Origin': 'https://vision.theorg.com',
            'Pragma': 'no-cache',
            'Referer': 'https://vision.theorg.com/',
            'Sec-Ch-Ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"macOS"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
          },
        }
      );

      const json = await response.json();
      return json;
    } catch(err) {
      this.logger.error(JSON.stringify({ correlationId, err: err.stack }));
      throw err;
    }
  };


  async get(correlationId:string, id: string): Promise<IReviewer> {
    const data = await this.reviewerModel.findById(id).exec();
    this.logger.log(JSON.stringify({ correlationId, data }));
    if (!data) {
      throw new NotFoundException(`History #${id} not found`);
    }

    if (!data.workHistory && !data.companyHistory && data.theorgId) {
      const workHistory = [];
      const companyHistory = [];

      const historyData = await this.getData({
        id: parseInt(data.theorgId, 10),
        correlationId,
        bearer: this.theorgBearer,
      });
      this.logger.log(JSON.stringify({ correlationId, data: historyData }));

      if (historyData?.data?.position?.previousCompanies) {
        (historyData?.data?.position?.previousCompanies || []).forEach(company => {
          companyHistory.push({
            name: company.companyName,
            startDate: company.startDate ? new Date(company.startDate) : null,
            endDate: company.endDate ? new Date(company.endDate) : null,
          });
        });
      }

      if (historyData?.data?.position?.roleTimeline) {
        (historyData?.data?.position?.roleTimeline || []).forEach(role => {
          workHistory.push({
            name: role.role,
            startDate: role.startDate ? new Date(role.startDate) : null,
            isCurrent: role.current !== undefined ? role.current : false,
          });
        });
      }

      data.workHistory = workHistory.length > 0 ? workHistory : null;
      data.companyHistory = companyHistory.length > 0 ? companyHistory : null;

      const updateResult = await this.reviewerModel.findByIdAndUpdate(data._id, data, { new: false });
      this.logger.log(JSON.stringify({ correlationId, data: updateResult }));
    }

    return data;
  }
}
