import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  getConfig(): Observable<any> {
    const mockConfig = {
      "courses": [
        {
          "id": "dsa",
          "name": "Data Structures & Algorithms",
          "components": {
            "practice": "PracticeComponent",
            "study": "StudyComponent"
          },
          "data": [
            {
              "question": "What is a data structure?",
              "answer": "A data structure is a way of organizing data so that it can be used effectively."
            },
            {
              "question": "Give an example of a data structure.",
              "answer": "An example of a data structure is an array."
            },
            {
              "question": "What is an algorithm?",
              "answer": "An algorithm is a set of instructions designed to perform a specific task."
            },
            {
              "question": "How does a stack data structure operate?",
              "answer": "A stack operates on the principle of Last-In, First-Out (LIFO)."
            },
            {
              "question": "What is the purpose of a queue data structure?",
              "answer": "A queue data structure operates on the First-In, First-Out (FIFO) principle, used for managing operations in sequential order."
            },
            {
              "question": "What is a binary search tree?",
              "answer": "A binary search tree is a tree data structure where each node has at most two children, and the left child's value is less than the parent, while the right child's value is greater."
            },
            {
              "question": "Explain the difference between linked list and array.",
              "answer": "Arrays have fixed sizes and contiguous memory allocation, while linked lists consist of nodes linked by pointers, allowing dynamic resizing and efficient insertion/deletion."
            },
            {
              "question": "What is a hash table?",
              "answer": "A hash table is a data structure that stores data in an associative manner, using a hash function to compute an index into an array of buckets or slots."
            },
            {
              "question": "What is recursion in programming?",
              "answer": "Recursion in programming refers to a function calling itself directly or indirectly to solve a problem by breaking it down into smaller and more manageable sub-problems."
            },
            {
              "question": "What is a graph data structure?",
              "answer": "A graph data structure consists of a set of nodes (or vertices) and edges connecting pairs of nodes, used to represent networks like social connections or pathways."
            }
          ]
        },
        {
          "id": "sql",
          "name": "SQL & Databases",
          "components": {
            "practice": "PracticeComponent",
            "study": "StudyComponent"
          },
          "data": [
            {
              "question": "What is SQL?",
              "answer": "SQL stands for Structured Query Language, and it is used to communicate with a database."
            },
            {
              "question": "What does 'SELECT' do in SQL?",
              "answer": "The SELECT statement is used to select data from a database."
            },
            {
              "question": "How do you add a column to an existing SQL table?",
              "answer": "You can add a column by using the ALTER TABLE command followed by ADD COLUMN."
            },
            {
              "question": "What is a JOIN in SQL?",
              "answer": "A JOIN in SQL is a means for combining columns from one or more tables based on the values of common columns between the tables."
            },
            {
              "question": "Describe the different types of SQL joins.",
              "answer": "The main types of joins are INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN, each differing in how rows are combined from two tables based on their keys."
            },
            {
              "question": "What is a primary key in SQL?",
              "answer": "A primary key is a field in a table which uniquely identifies each row/record in that table."
            },
            {
              "question": "What is a foreign key?",
              "answer": "A foreign key is a column or a set of columns in one table that uniquely identifies a row of another table or the same table."
            },
            {
              "question": "How do you create an index in SQL?",
              "answer": "You create an index using the CREATE INDEX statement, which allows the database to search the indexed field more quickly."
            },
            {
              "question": "What is normalization in SQL?",
              "answer": "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity."
            },
            {
              "question": "What is a stored procedure in SQL?",
              "answer": "A stored procedure is a prepared SQL code that you can save and reuse over and over again, which can be executed with different parameters."
            }
          ]
        },
        {
          "id": "sanskrit",
          "name": "Sanskrit",
          "components": {
            "practice": "PracticeComponent",
            "study": "StudyComponent"
          },
          "data": [
            {
              "question": "What is the Sanskrit letter for the sound 'ka' from the 'Kavarga' group?",
              "answer": "क"
            },
            {
              "question": "How do you write the sound 'ma' from the 'Antastha' group in Sanskrit?",
              "answer": "म"
            },
            {
              "question": "Which Sanskrit letter corresponds to the sound 'sha' from the 'Ushmana' group?",
              "answer": "श"
            },
            {
              "question": "What is the correct Sanskrit letter for the sound 'ta' from the 'Tavarga' group?",
              "answer": "त"
            },
            {
              "question": "Write the Sanskrit letter for the sound 'ra' from the 'Antastha' group.",
              "answer": "र"
            },
            {
              "question": "Which letter is used in Sanskrit for the sound 'na' from the 'Navarga' group?",
              "answer": "न"
            },
            {
              "question": "How is the sound 'dha' represented in Sanskrit from the 'Tavarga' group?",
              "answer": "ध"
            },
            {
              "question": "What is the Sanskrit letter for the sound 'cha' from the 'Chavarga' group?",
              "answer": "च"
            },
            {
              "question": "Which letter corresponds to the sound 'pa' from the 'Pavarga' group?",
              "answer": "प"
            },
            {
              "question": "Write the Sanskrit letter for the sound 'gha' from the 'Kavarga' group.",
              "answer": "घ"
            },
            {
              "question": "When is the earliest known Sanskrit text, the Rigveda, believed to have been composed?",
              "answer": "Around 1500 BCE"
            },
            {
              "question": "What script was traditionally used to write Sanskrit before the adoption of Devanagari?",
              "answer": "Brahmi script"
            },
            {
              "question": "Which Indian grammarian wrote the foundational work on Sanskrit grammar known as the Ashtadhyayi?",
              "answer": "Panini"
            },
            {
              "question": "In what era did Sanskrit become the classical language of India, primarily used for religious and scholarly texts?",
              "answer": "Gupta Empire (around 4th century CE)"
            },
            {
              "question": "Which famous Indian epic is written in classical Sanskrit?",
              "answer": "Mahabharata"
            },
            {
              "question": "What was the primary purpose of Sanskrit in ancient India?",
              "answer": "Religious rituals and scholarly discourse"
            },
            {
              "question": "Which modern languages are directly descended from Sanskrit?",
              "answer": "Hindi, Bengali, Marathi, and others"
            },
            {
              "question": "Which script is predominantly used to write Sanskrit today?",
              "answer": "Devanagari script"
            },
            {
              "question": "Which text is considered the oldest surviving Sanskrit literature?",
              "answer": "Rigveda"
            }
          ]
        }
      ]
    };
    console.log("Mock config returned:", mockConfig); // Log the mock config that is returned
    return of(mockConfig);
  }
}