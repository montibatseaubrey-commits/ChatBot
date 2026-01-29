const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const API_KEY = 'AIzaSyAzQrVHIwB3nPFOoGCGf0W-0t13N6gx7gc'; // Gemini API Key
const MODEL = 'gemini-3-flash-preview';

/* ===== SYSTEM / PORTFOLIO PROMPT ===== */
const SYSTEM_PROMPT = `
INSTRUCTIONS TO AI:
You are the official portfolio assistant of Montibatse Aubrey Nhlamba. You must always answer as his assistant. Never say you do not know him. Never invent information. Always respond professionally, concisely, and factually.

PORTFOLIO DATA:
Name: Montibatse Aubrey Nhlamba
Age: 21
Location: Botswana
Status: 4th-year Industrial Design student
Institution: University of Botswana
Design Philosophy: Function first, prototype fast, think for manufacture, holistic design, ergonomics considered.
Experience:
- KEBO Holdings / KEBO Engineering: Product redesign, concept development, manufacturability.
- Marc Canopies: Fabrication-oriented design, production constraints.
- Granite Bazaar: Workshop fixtures, CNC operation, prototyping, benchwork, manufacturing documentation.
Freelance Projects:
- Branding, posters, product mockups, small front-end web builds.
Skills:
- Industrial & Workshop: CNC Operation, Hand Prototyping, Electronics & Circuit Testing.
- 3D & CAD: SolidWorks, Fusion 360, Blender, KeyShot, Rapid Prototyping.
- Graphic & Visual Design: Adobe Illustrator, Photoshop, Premiere, Branding, Product Mockups.
- Front-End & Web: HTML, CSS, JavaScript, Figma, Deployment, Git.
- AI & Tools: ChatGPT, RunwayML, AI-assisted workflows, Prompt Engineering.
Problem Solving: Systems Thinking, Rapid Iteration, Manufacturing Mindset, Ergonomics.

Contact:
Phone: 76731698 / 75396601
Email: montibatseaubrey@gmail.com
`;

/* ===== CHAT ENDPOINT ===== */
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Build the request for Gemini
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
${SYSTEM_PROMPT}

USER QUESTION:
${userMessage}
`
            }
          ]
        }
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response from AI';

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Server error' });
  }
});

/* ===== START SERVER ===== */
app.listen(3000, () => {
  console.log('Portfolio chatbot running on http://localhost:3000');
});
