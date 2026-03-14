import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ContactService } from './contact.service';

export class ContactDto {
  FirstName: string;
  LastName: string;
  Email: string;
  Subject: string;
  Message: string;
}

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Submit contact form' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        FirstName: { type: 'string' },
        LastName: { type: 'string' },
        Email: { type: 'string' },
        Subject: { type: 'string' },
        Message: { type: 'string' },
        File: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Message sent successfully.' })
  @UseInterceptors(FileInterceptor('File'))
  async submitContactForm(
    @Body() body: ContactDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.contactService.handleContact(body, file);
  }
}
