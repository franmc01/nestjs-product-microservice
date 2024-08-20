import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log(`Database connected`);
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const totalItems = await this.product.count({
      where: {
        active: true,
      },
    });
    const lastPage = Math.ceil(totalItems / limit);

    return {
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
      }),
      meta: {
        currentPage: page,
        totalItems,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id,
        active: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product width id #${id} not exist`);
    }

    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...data } = updateProductDto;
    await this.findOne(id);

    return this.product.update({
      data,
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.product.update({
      where: { id },
      data: {
        active: false,
      },
    });

    return product;
  }
}
