export interface IDateProvider {
  compareInHours(start_dat: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
  dayAdd24Hours(): Date;
  compareInDays(start_date: Date, end_date: Date): number; 
  addDays(days: number): Date;
  addHours(hours: number): Date;
  compareIfBefore(start_date: Date, end_date: Date): Boolean;
}