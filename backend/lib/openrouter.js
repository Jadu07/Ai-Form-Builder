require('dotenv').config();
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

class OpenRouterService {
  async generateFormSchema(userPrompt) {
    try {
      const systemPrompt = `You are a JSON Schema generator. Given a natural-language description of a form, output a JSON object with the following structure:
{
  "schema": {
    "type": "object",
    "properties": {
      // Define form fields here
    }
  },
  "uiSchema": {
    // UI configuration for each field
  },
  "required": [
    // Array of required field names
  ],
  "followups": [
    // Array of clarification questions if needed
  ]
}

Make sure the schema follows JSON Schema specification and the uiSchema follows react-jsonschema-form conventions.`;

      const response = await axios.post(OPENROUTER_URL, {
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:4000',
          'X-Title': 'Form Generator App'
        }
      });

      const content = response.data.choices[0].message.content;
      
      // Try to parse JSON from the response
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('No valid JSON found in response');
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.error('Raw response:', content);
        
        // Fallback: generate a basic schema based on the prompt
        return this.generateFallbackSchema(userPrompt);
      }
    } catch (error) {
      console.error('OpenRouter API error:', error.response?.data || error.message);
      
      // Check if it's an API key issue or other errors, use fallback
      if (error.response?.status === 401) {
        console.warn('OpenRouter API key is invalid, using fallback schema generation');
        return this.generateFallbackSchema(userPrompt);
      } else if (error.response?.status === 429) {
        console.warn('OpenRouter API rate limit exceeded, using fallback schema generation');
        return this.generateFallbackSchema(userPrompt);
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.warn('Network error, using fallback schema generation');
        return this.generateFallbackSchema(userPrompt);
      }
      
      console.warn('OpenRouter API error, using fallback schema generation');
      return this.generateFallbackSchema(userPrompt);
    }
  }

  generateFallbackSchema(userPrompt) {
    // Simple keyword-based schema generation as fallback
    const prompt = userPrompt.toLowerCase();
    const schema = {
      type: "object",
      properties: {},
      required: []
    };
    const uiSchema = {};
    const followups = [];

    // Common field patterns
    if (prompt.includes('name') || prompt.includes('full name')) {
      schema.properties.name = {
        type: "string",
        title: "Full Name"
      };
      uiSchema.name = {
        "ui:placeholder": "Enter your full name"
      };
      schema.required.push("name");
    }

    if (prompt.includes('email') || prompt.includes('e-mail')) {
      schema.properties.email = {
        type: "string",
        title: "Email",
        format: "email"
      };
      uiSchema.email = {
        "ui:placeholder": "Enter your email address"
      };
      schema.required.push("email");
    }

    if (prompt.includes('phone') || prompt.includes('mobile') || prompt.includes('contact')) {
      schema.properties.phone = {
        type: "string",
        title: "Phone Number"
      };
      uiSchema.phone = {
        "ui:placeholder": "Enter your phone number"
      };
      schema.required.push("phone");
    }

    if (prompt.includes('message') || prompt.includes('comment') || prompt.includes('feedback')) {
      schema.properties.message = {
        type: "string",
        title: "Message",
        format: "textarea"
      };
      uiSchema.message = {
        "ui:widget": "textarea",
        "ui:placeholder": "Enter your message"
      };
      schema.required.push("message");
    }

    if (prompt.includes('age')) {
      schema.properties.age = {
        type: "number",
        title: "Age",
        minimum: 0,
        maximum: 120
      };
      uiSchema.age = {
        "ui:placeholder": "Enter your age"
      };
      schema.required.push("age");
    }

    if (prompt.includes('company') || prompt.includes('organization')) {
      schema.properties.company = {
        type: "string",
        title: "Company/Organization"
      };
      uiSchema.company = {
        "ui:placeholder": "Enter your company name"
      };
      schema.required.push("company");
    }

    // If no fields were detected, add basic fields
    if (Object.keys(schema.properties).length === 0) {
      schema.properties.name = {
        type: "string",
        title: "Name"
      };
      uiSchema.name = {
        "ui:placeholder": "Enter your name"
      };
      schema.required.push("name");

      schema.properties.email = {
        type: "string",
        title: "Email",
        format: "email"
      };
      uiSchema.email = {
        "ui:placeholder": "Enter your email"
      };
      schema.required.push("email");
    }

    return {
      schema,
      uiSchema,
      required: schema.required,
      followups: ["This is a basic form generated from your description. You can edit it to add more specific fields."]
    };
  }

  async refineFormSchema(currentSchema, userInstruction) {
    try {
      const systemPrompt = `You are a JSON Schema editor. Given the existing schema and a user instruction, update the schema accordingly and output only the modified JSON object with the same structure as before:
{
  "schema": {...},
  "uiSchema": {...},
  "required": [...],
  "followups": [...]
}

Preserve the existing structure and only modify what the user requested.`;

      const response = await axios.post(OPENROUTER_URL, {
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Current schema: ${JSON.stringify(currentSchema)}\n\nUser instruction: ${userInstruction}` 
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:4000',
          'X-Title': 'Form Generator App'
        }
      });

      const content = response.data.choices[0].message.content;
      
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('No valid JSON found in response');
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.error('Raw response:', content);
        
        // Return the original schema if parsing fails
        return currentSchema;
      }
    } catch (error) {
      console.error('OpenRouter API error:', error.response?.data || error.message);
      throw new Error('Failed to refine form schema');
    }
  }
}

module.exports = new OpenRouterService();
