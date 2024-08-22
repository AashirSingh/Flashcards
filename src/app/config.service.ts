import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  getConfig(): Observable<any> {
    // Mock data similar to what your config.json provides
    const mockConfig = {
      "courses": [
        {
          "id": "dsa",
          "name": "Data Structures & Algorithms",
          "components": {
            "practice": "PracticeComponent",
            "study": "StudyComponent"
          },
          "dataEndpoint": "mock"
        },
        {
          "id": "sql",
          "name": "SQL & Databases",
          "components": {
            "practice": "PracticeComponent",
            "study": "StudyComponent"
          },
          "dataEndpoint": "mock"
        }
      ]
    };
    return of(mockConfig); // Return the mock data as an Observable
  }
}