import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  Customer,
  CustomerDocument,
} from 'src/modules/client/schemas/client.schema';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Customer.name, 'HelperMongo')
    private customerModel: Model<CustomerDocument>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<CustomerDocument> {
    let payload = { ...createClientDto };
    if (createClientDto.latitude && createClientDto.longitude) {
      payload['location'] = {
        type: 'Point',
        coordinates: [createClientDto.longitude, createClientDto.latitude],
      };
    }
    const createdClient = new this.customerModel(payload);
    const newClient = await createdClient.save();

    const client = await this.customerModel.findById(newClient.id, {
      active: 0,
      date: 0,
      latitude: 0,
      longitude: 0,
      altitude: 0,
      precision: 0,
      altitudePrecision: 0,
      header: 0,
      creationDate: 0,
      updateDate: 0,
      __v: 0,
    });

    return client;
  }

  async findAll(filters = {}): Promise<CustomerDocument[]> {
    const clients: CustomerDocument[] = await this.customerModel
      .find(filters, {
        active: 0,
        date: 0,
        latitude: 0,
        longitude: 0,
        altitude: 0,
        precision: 0,
        altitudePrecision: 0,
        header: 0,
        creationDate: 0,
        updateDate: 0,
        location: 0,
        __v: 0,
      })
      .populate({
        path: 'areas',
        select: 'name',
      })
      .populate({
        path: 'jobs',
        select: 'name',
      })
      .populate({
        path: 'specials',
        select: 'name',
      })
      .exec();
    return clients;
  }

  async findOne(id: string): Promise<CustomerDocument> {
    const client: CustomerDocument = await this.customerModel
      .findById(id)
      .select('id businessName')
      .populate({
        path: 'areas',
        select: 'name',
      })
      .populate({
        path: 'jobs',
        select: 'name',
      })
      .populate({
        path: 'specials',
        select: 'name',
      })
      .exec();
    return client;
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<CustomerDocument> {
    let payload = { ...updateClientDto };
    if (updateClientDto.latitude && updateClientDto.longitude) {
      payload['location '] = {
        type: 'Point',
        coordinates: [updateClientDto.longitude, updateClientDto.latitude],
      };
    }

    const updatedClient: CustomerDocument = await this.customerModel
      .findByIdAndUpdate(id, updateClientDto, { new: true })
      .select('id businessName')
      .populate({
        path: 'areas',
        select: 'name',
      })
      .populate({
        path: 'jobs',
        select: 'name',
      })
      .populate({
        path: 'specials',
        select: 'name',
      })
      .exec();
    return updatedClient;
  }

  async remove(id: string): Promise<string> {
    const deletedClient: CustomerDocument =
      await this.customerModel.findByIdAndDelete(id);
    return 'Cliente eliminado';
  }
}
