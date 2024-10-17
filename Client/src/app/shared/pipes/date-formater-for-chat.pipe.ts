import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormaterForChat',
  standalone: true
})
export class DateFormaterForChatPipe implements PipeTransform {

  transform(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); 
  
    if (this.isSameDay(date, today)) return 'Today';
    if (this.isSameDay(date, yesterday)) return 'Yesterday';
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[date.getDay()];
    
    if (date > new Date(today.setDate(today.getDate() - today.getDay()))) {
      return dayName;
    }
    
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

}
