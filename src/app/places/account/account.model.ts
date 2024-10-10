export class Account {
  constructor(
    public id: string,
    public userId: string,
    public name: string,
    public email: string,
    public phone: string,
    public items: any[] = [],
    public role: string 
  ) {}
}