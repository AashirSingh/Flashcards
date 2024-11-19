export interface Course {
  id: number;
  name: string;
  description: string;
  filePath?: string;
  topics?: Topic[];  // Add the topics property to store the list of topics/questions
  components: {
    practice: any;
    study: any;
    quiz: any;
  };
}

export interface Topic {
  title: string;
}
