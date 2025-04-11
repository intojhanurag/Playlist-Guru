const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-bison-001' });

    const result = await model.generateContent(['Say hello from Gemini!']);
    const response = result.response;
    const text = await response.text();

    console.log('✅ Gemini says:\n', text);
  } catch (err) {
    console.error('❌ Gemini Error:', err.message);
  }
}

main();
