import { ValidateIf, ValidationOptions } from 'class-validator';

export function IsNotNull(validationOptions?: ValidationOptions) {
  return ValidateIf((_object, value) => value === null, validationOptions);
}
