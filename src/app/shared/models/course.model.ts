export interface Course {
    id: number;
    name: string;
    description: string;
    components: {
      practice: any;
      study: any;
    };
  }