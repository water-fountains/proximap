import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value, limit = 25, completeWords = false, ellipsis = '...') {
    if((typeof value) === 'string'){

      if (completeWords) {
        limit = value.substr(0, 13).lastIndexOf(' ');
      }
      ellipsis = (value.length > limit)?ellipsis: '';
      return `${value.substr(0, limit)}${ellipsis}`;
    }else{
      return value;
    }
  }
}
