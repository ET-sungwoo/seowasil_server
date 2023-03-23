import { UsersRepository } from './../users/users.repository';
import { ProductsRepository } from './../products/products.repository';
import { SmsService } from './../sms/sms.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersRepository)
    private ordersRepository: OrdersRepository,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(ProductsRepository)
    private productsRepository: ProductsRepository,
    private smsService: SmsService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { user_id, product_id } = createOrderDto;
    const user = await this.usersRepository.findOne({ id: user_id });
    const product = await this.productsRepository.findOne({ id: product_id });
    const order = this.ordersRepository.create({
      ...createOrderDto,
      user,
      product,
    });
    const content = `${order.price}원을 ㅇㅇㅇ으로 보내주세요`;
    const result = await this.smsService.sendSMS(order.phoneNumber, content);
    if (result) return await this.ordersRepository.save(order);
    else
      throw new HttpException(
        '알 수 없는 오류로 인해 서비스가 제한되었습니다. 다시 수행해주세요.',
        HttpStatus.BAD_REQUEST,
      );
  }

  async getOrderList() {
    const result = await this.ordersRepository.find();
    return result;
  }
}
