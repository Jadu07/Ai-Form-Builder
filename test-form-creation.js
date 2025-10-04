const axios = require('axios');

async function testFormCreation() {
  try {
    console.log('Testing form creation...');
    
    // First, let's test if the server is running
    const healthResponse = await axios.get('http://localhost:4000/api/health');
    console.log('✅ Server is running:', healthResponse.data);
    
    // Test OpenRouter API directly
    console.log('\nTesting OpenRouter API...');
    const openRouterResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [
        { role: "system", content: "You are a JSON Schema generator. Given a natural-language description of a form, output a JSON object with the following structure: { \"schema\": { \"type\": \"object\", \"properties\": {} }, \"uiSchema\": {}, \"required\": [], \"followups\": [] }" },
        { role: "user", content: "Create a simple contact form with name and email" }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:4000',
        'X-Title': 'Form Generator App'
      }
    });
    
    console.log('✅ OpenRouter API is working');
    console.log('Response:', openRouterResponse.data.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testFormCreation();
