import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, BehaviorSubject  } from 'rxjs';
import { from } from 'rxjs';
import { Course } from './shared/models/course.model';


const supabaseUrl = 'https://muuaktpmdgrchhrjkqcu.supabase.co';  // Replace with your actual Project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dWFrdHBtZGdyY2hocmprcWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ4NzQwMjAsImV4cCI6MjA0MDQ1MDAyMH0.UjXLTdzJTQJ-KqMGtcoSvQeYdYGcx2la7ZjKPFe53x4';  // Replace with your actual Anon Key
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  getCourses(): Observable<Course[]> {
    return from(this.fetchCoursesFromSupabase());
  }

  private async fetchCoursesFromSupabase(): Promise<Course[]> {
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        id,
        name,
        description,
        questions:questions (
          question,
          answer
        )
      `);

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    if (!courses || courses.length === 0) {
      console.error('No courses found.');
      return [];
    }

    return courses.map(course => ({
      id: course.id,
      name: course.name,
      description: course.description,
      components: {
        practice: { questions: course.questions || [] },
        study: { questions: course.questions || [] }
      }
    }));
  }

  // Add a new question and answer to a specific course
  async addQuestionToCourse(courseId: number, question: string, answer: string): Promise<void> {
    const { data, error } = await supabase
      .from('questions')
      .insert([{ course_id: courseId, question, answer }]);

    if (error) {
      throw error;
    }

    console.log('Question added:', data);
  }
}