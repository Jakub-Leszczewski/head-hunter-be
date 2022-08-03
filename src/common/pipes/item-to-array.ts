import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ItemToArray implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    return [value];
  }
}
