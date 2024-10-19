import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formateTime',
  standalone: true
})
export class FormateTimePipe implements PipeTransform {

  transform(createdDate: Date): string {
    const date: Date = new Date(createdDate);
    
    let hours = date.getHours();
    let minutes: number | string = date.getMinutes();
  
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
  }
}
