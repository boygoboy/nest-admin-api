import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNumericString(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isNumericString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && !isNaN(Number(value));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a numeric string`;
        }
      }
    });
  };
}
