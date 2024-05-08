import { BadRequestException } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isBase64,
  isMimeType,
} from 'class-validator';

export function trim(value: string): string {
  if ('string' === typeof value) {
    return value.trim();
  }
}

@ValidatorConstraint({ name: 'customText', async: false })
export class ImageBase64Validator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
  validate(value: string, args: ValidationArguments) {
    // Implement your custom validation logic here
    // Validation to allow option param logo
    if ('' == value) {
      return true;
    }
    if (!value || 'string' !== typeof value) {
      throw new BadRequestException('Invalid base64 string');
    }
    const parts = value.split(',');
    if (2 !== parts.length) {
      throw new BadRequestException('Invalid data URI');
    }
    // eslint-disable-next-line prefer-destructuring
    const mimeType = parts[0].split(';')[0].split(':')[1];
    // eslint-disable-next-line prefer-destructuring
    const base64Data = parts[1];

    // Validate MIME type
    if (!isMimeType(mimeType)) {
      throw new BadRequestException('Please provide valid MIME type');
    }
    // Validate base64 data
    if (!isBase64(base64Data) || '' == base64Data || null == base64Data) {
      throw new BadRequestException('Invalid base64 string');
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'Default message received from [ImageBase64Validator]';
  }
}
