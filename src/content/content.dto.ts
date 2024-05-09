/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBase64, IsOptional, IsString, Validate } from 'class-validator';
import { ImageBase64Validator, trim } from 'src/commons/helpers';

export class FileUploadDto {
  @ApiPropertyOptional()
  @IsOptional()
  //   @Transform(({ value }) => trim(value))
  //   @Validate(ImageBase64Validator)
  file: any = '';

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  author: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  publishedBy: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  editor: string;

  // Parameter taken from query,  mentioned here to be forwarded
  fileName: string;
}
