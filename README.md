# AI Resume Shortlisting & Interview Assistant System

A high-performance, autonomous intelligence system designed to select required number of candidates with the help of their resume. This system parses unstructured PDF resumes, compares them against Job Descriptions (JDs) using **Gemini 2.5 Flash**, and generates multi-dimensional scores with natural language explanations.


## 🚀 Setup Instructions
Deploy the full stack locally in under 5 minutes.

### 1. Clone & Install
```bash
# Clone the repository
git clone <your-repo-url>
cd ai-shortlisting-system

# Install Backend dependencies
cd backend && npm install

# Install Frontend dependencies
cd ../frontend && npm install
```


### 2. Environment Setup
Create a .env file in the backend folder
```bash
PORT = 5000
GEMINI_API_KEY = your_google_ai_studio_key_here
```


### 3. Launch
Open two separate terminals:
1. Backend : cd backend && npm run dev
2. Frontend : cd frontend && npm run dev
3. Access : Open http://localhost:5173 (Vite default)


## Architecture Overview
The system utilizes a Service-Oriented Architecture (SOA) built with TypeScript for end-to-end type safety:

1. Parsing Layer: Uses pdf-parse to extract raw text from binary buffers.

2. Reasoning Layer (LLM): Integration with Gemini 2.5 Flash using structured JSON schemas to ensure consistent output.

3. Scoring Engine: A custom algorithm that averages four distinct AI-generated metrics:

   - Exact Match: Direct tech-stack overlap.

   - Semantic Similarity: Identifying transferable skills (e.g., Kafka to RabbitMQ).

   - Impact/Achievement: Extracting quantifiable results (%, $).

   - Ownership: Evaluating leadership and end-to-end project responsibility.


## Assumptions & Trade-offs
1. Stateless Processing: For this MVP, I assumed a stateless flow where data is processed in-memory.
Trade-off: Faster response times but lacks persistence; a production version would include PostgreSQL/Redis for historical tracking.

2. Prompt Engineering vs. Fine-tuning: I chose advanced Prompt Engineering with JSON Schema over fine-tuning. 
Trade-off: Lower cost and faster iteration, though fine-tuning might provide slightly higher accuracy for niche industries.


## ⚠️ Known Limitations & Future Roadmap
- Rate Limits: The current system is limited by the free tier RPM of Google AI Studio.

- Bulk Scalability: For 10,000+ resumes, the current Promise.all logic would hit memory limits.
Next Step: Implement BullMQ with Redis for background job processing and a Vector DB (Pinecone) for pre-filtering candidates before LLM analysis.

- Verification: Future versions will integrate the GitHub API to cross-reference "Achievement" scores with actual commit history and repository impact.

## 🤖 AI Collaboration Disclosure
- AI Usage: I utilized AI for generating boilerplate Tailwind configurations, brainstorming the initial system architecture, and debugging TypeScript ESM module resolution issues.

- Manual Review & Changes: I manually refactored the Multer middleware to handle complex multipart/form-data, designed the "No-Scroll" Viewport Layout to ensure the UI fits one screen, and tuned the JSON Schema to ensure the LLM never returned malformed data.

- The Disagreement: The AI suggested a simple "Pass/Fail" classification. I disagreed because recruiters need nuance. I manually implemented the Tier-based system (Tier A, B, C) with multi-dimensional scoring to provide deep "Explainability" for every candidate.


## Here are the snapshots of the working project
This is how the page looks initially
<img width="1918" height="869" alt="image" src="https://github.com/user-attachments/assets/6a6415cc-c9d7-4140-ad33-deec2c8d36b6" />

Now we filled the required data
<img width="1919" height="858" alt="image" src="https://github.com/user-attachments/assets/3284b71c-8928-4229-ae4d-b2d75fd4cf29" />

Here is our output (I attached 6 resumes of the same person)
<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/9e49e658-a926-47cb-a088-9d51fac1bd79" />


