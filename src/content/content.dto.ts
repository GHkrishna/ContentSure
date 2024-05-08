/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { ImageBase64Validator, trim } from 'src/commons/helpers';

export class FileUploadDto {
  @ApiPropertyOptional()
  @IsOptional()
  //   @Transform(({ value }) => trim(value))
  //   @Validate(ImageBase64Validator)
  file: any = '';

  // Parameter taken from query,  mentioned here to be forwarded
  fileName: string;
}
