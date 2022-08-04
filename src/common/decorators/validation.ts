import {
  registerDecorator,
  ValidateIf,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsNotNull(validationOptions?: ValidationOptions) {
  return ValidateIf((_object, value) => value !== undefined, validationOptions);
}

export function IsBooleanArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    validationOptions = validationOptions ?? {};
    validationOptions.message =
      validationOptions.message ??
      `${propertyName} must be a valid boolean or string boolean value`;

    registerDecorator({
      name: 'isBooleansArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const newValue = value instanceof Array ? [...value] : [value];

          for (let i = 0; i < newValue.length; i++) {
            switch (newValue[i]) {
              case 'true': {
                newValue[i] = true;
                break;
              }
              case 'false': {
                newValue[i] = false;
                break;
              }
              case true: {
                newValue[i] = true;
                break;
              }
              case false: {
                newValue[i] = false;
                break;
              }
              default:
                return false;
            }
          }

          args.object[propertyName] = newValue;
          return true;
        },
      },
    });
  };
}

export function IsEnumArray(Entity: Object, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    validationOptions = validationOptions ?? {};
    validationOptions.message =
      validationOptions.message ?? `${propertyName} must be a valid enum value`;

    registerDecorator({
      name: 'isBooleansArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const newValue = value instanceof Array ? [...value] : [value];

          for (let i = 0; i < newValue.length; i++) {
            if (!Object.values(Entity).includes(newValue[i])) {
              return false;
            }
          }

          args.object[propertyName] = newValue;
          return true;
        },
      },
    });
  };
}
