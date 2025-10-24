// Simple test script to call the analyze-skills function and see the actual error
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bzddkmmjqwgylckimwiq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZGRrbW1qcXdneWxja2ltd2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTQ3MTQsImV4cCI6MjA1MjI3MDcxNH0.UqYlV0KJW3_H8yJgJf4JKMb5QQ_dO6_Ot8-hf2eHXTI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSkillAnalysis() {
  try {
    console.log('Testing skill analysis function...');
    
    const testCV = `
      Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js.
      Led development of enterprise applications serving 100K+ users.
      Strong leadership and communication skills.
    `;

    const { data, error } = await supabase.functions.invoke('analyze-skills', {
      body: {
        cv_text: testCV,
        job_title: 'Software Engineer',
        industry: 'Technology'
      }
    });

    console.log('Response:', JSON.stringify({ data, error }, null, 2));
  } catch (err) {
    console.error('Test error:', err);
  }
}

testSkillAnalysis();

