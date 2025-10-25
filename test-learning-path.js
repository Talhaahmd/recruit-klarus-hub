// Test script to check learning path generation
// Run this in your browser console on the Learning Path page

async function testLearningPathGeneration() {
    console.log('Testing learning path generation...');
    
    try {
        // Test data
        const testRequest = {
            skill_gaps: ['React', 'Data Analysis'],
            target_role: 'Senior Developer',
            industry: 'Technology',
            experience_level: 'intermediate',
            time_commitment: '5-10',
            learning_goals: ['Get promoted', 'Learn new skills']
        };
        
        console.log('Request data:', testRequest);
        
        // Call the learning path service
        const response = await fetch('/api/generate-learning-path', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
            },
            body: JSON.stringify(testRequest)
        });
        
        const result = await response.json();
        console.log('Response:', result);
        
        if (result.success) {
            console.log('Learning path generated successfully');
            console.log('Path ID:', result.learning_path.id);
            
            // Now check if items were created
            const itemsResponse = await fetch(`/api/learning-path-items/${result.learning_path.id}`);
            const items = await itemsResponse.json();
            console.log('Learning path items:', items);
            
        } else {
            console.error('Learning path generation failed:', result.error);
        }
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test
testLearningPathGeneration();
