// test/load-test.ts
import axios from 'axios';

const API_URL = `http://localhost:3000`; 

interface TaskPayload {
  title: string;
  description: string;
  type: string;
  isRepeatable: boolean;
  priority: number;
  scheduledAt?: string;
  repeatPattern?: string;
}

async function createTask(payload: TaskPayload) {
  try {
    const response = await axios.post(`${API_URL}/tasks/create`, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function loadTest100Tasks() {
  console.log('🚀 Starting load test: 100 tasks...');
  const startTime = Date.now();
  
  const promises = [];
  
  for (let i = 1; i <= 100; i++) {
    const task: TaskPayload = {
      title: `Load Test Task ${i}`,
      description: `This is test task number ${i}`,
      type: 'load-test',
      priority: Math.floor(Math.random() * 3) + 1,
      isRepeatable: false, 
    };
    
    promises.push(createTask(task));
  }
  
  // Execute all requests
  const results = await Promise.all(promises);
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  // Calculate stats
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n📊 Load Test Results:');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Total Duration: ${duration}ms`);
  console.log(`⚡ Average per task: ${(duration / 100).toFixed(2)}ms`);
  console.log(`📈 Throughput: ${(100 / (duration / 1000)).toFixed(2)} tasks/sec`);
  console.log('='.repeat(50));
}

// Run the test
loadTest100Tasks()
  .then(() => {
    console.log('\n✨ Load test completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Load test failed:', error);
    process.exit(1);
  });