export interface Course {
    id: string;
    name: string;
    description: string;
    data: { question: string, answer: string }[];
    components: {
      practice: any;
      study: any;
    };
  }