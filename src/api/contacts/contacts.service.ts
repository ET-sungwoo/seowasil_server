import { ContactsRepository } from './contacts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactsRepository)
    private contactsRepository: ContactsRepository,
  ) {}

  async createContact(createContactDto: CreateContactDto) {
    const result = await this.contactsRepository.save({
      ...createContactDto,
    });
    return result;
  }

  async getContactList() {
    const result = await this.contactsRepository
      .createQueryBuilder('contact')
      .select([
        'contact.id',
        'contact.title',
        'contact.name',
        'contact.category',
      ])
      .orderBy('contact.createdAt', 'DESC')
      .getMany();
    return result;
  }

  async getContact(id: number) {
    const result = await this.contactsRepository
      .createQueryBuilder('contact')
      .select([
        'contact.id',
        'contact.title',
        'contact.description',
        'contact.name',
        'contact.password',
        'contact.category',
      ])
      .where('id = :id', { id })
      .getOne();

    return result;
  }

  async updateContact(updateContactDto: UpdateContactDto, id: number) {
    const result = await this.contactsRepository
      .createQueryBuilder('contact')
      .update(Contact)
      .set({ ...updateContactDto })
      .where('id = :id', { id })
      .execute();
    return result;
  }

  async deleteContact(id: number) {
    return await this.contactsRepository.delete(id);
  }
}
