/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FileUploadDto {
  @ApiPropertyOptional()
  @IsOptional()
  //   @Transform(({ value }) => trim(value))
  //   @Validate(ImageBase64Validator)
  file: any = '';

  @ApiProperty({ example: 'TitleCustom' })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Alice' })
  @IsOptional()
  @IsString()
  authorName: string;

  @ApiProperty({ example: 'https://twitter.com' })
  @IsOptional()
  @IsString()
  authorSocial: string;

  @ApiProperty({ example: 'Snippet News' })
  @IsOptional()
  @IsString()
  publishedBy: string;

  @ApiProperty({ example: 'Bob' })
  @IsOptional()
  @IsString()
  editor: string;

  @ApiProperty({ example: 'krishna123@yopmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  authorEmail: string;
}
