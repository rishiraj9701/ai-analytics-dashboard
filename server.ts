import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Safe lazy-loaded Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.warn("GEMINI_API_KEY is not defined. AI insights and helper will operate in simulation mode.");
        return null;
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // --- API Routes ---

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Actionable Insights AI generator
  app.post("/api/ai/insights", async (req, res) => {
    try {
      const { metrics } = req.body;
      const client = getGeminiClient();

      if (!client) {
        // Return rich, professional simulated insights if no key is configured
        return res.json({
          success: true,
          isSimulated: true,
          insights: [
            "📈 **AI Token Allocation optimization**: Response tokens account for 68% of total utilization. Recommending aggressive system greeting compression to save up to **18.4% on daily cost**.",
            "⚡ **Model Latency Spike**: Peak latency spiked to **310ms** at 14:02 UTC due to concurrency overload in European server zones. Recommend implementing multi-region cluster round-robin.",
            "👥 **Engineering Task Congestion**: Open tasks under **Enterprise Workspace SSO** have increased by **42%**. We project a 1.2-week delay in Q3 milestones if additional engineering resources are not reassigned."
          ]
        });
      }

      const prompt = `You are an elite, highly professional SaaS telemetry & AI analytics advisor. Analyze these current metrics for our cloud platform:
      - Daily Active Users (DAU): ${metrics?.dau || '12,450'} (${metrics?.dauTrend || '+12%'})
      - Average AI Latency: ${metrics?.latency || '142ms'} (${metrics?.latencyTrend || '-4%'})
      - Monthly Accumulated AI Cost: $${metrics?.cost || '1,240.20'} (${metrics?.costTrend || '+8%'})
      - API Incident Success Rate: ${metrics?.successRate || '99.96%'}
      - Active Project Count: ${metrics?.projectCount || '5 active'}
      
      Generate exactly 3 professional, deep, actionable bullet-point insights for the operations and business teams. Use elegant SaaS terminology and strong visual bold markdown highlighting (similar to Stripe or Vercel reports).
      
      Output MUST be a single raw JSON string array containing exactly 3 strings (bullet points). No extra text, wrapping, or explaining. Valid JSON array only.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: { type: "string" }
          }
        }
      });

      const parsedInsights = JSON.parse(response.text || "[]");
      res.json({ success: true, insights: parsedInsights, isSimulated: false });
    } catch (err: any) {
      console.error("Gemini API Insights error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // AI Analyst Chat helper
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const client = getGeminiClient();

      if (!client) {
        // Beautiful mock answers
        let answer = "";
        const lower = message.toLowerCase();
        if (lower.includes("revenue") || lower.includes("sales") || lower.includes("mrr") || lower.includes("cost")) {
          answer = "Based on our current telemetry database, **Monthly Recurring Revenue (MRR)** stands at **$142,500** (+8.2% growth month-over-month), driven primarily by Enterprise expansion pipelines. Conversely, **AI API operational expenditure** has grown to **$14,200** due to larger batch embedding queues. Our core subscription margin remains a healthy **64.2%**.";
        } else if (lower.includes("latency") || lower.includes("speed") || lower.includes("slow") || lower.includes("performance")) {
          answer = "Our average processing **AI model response latency** is holding solid at **142ms**, which is safely under our SLA target of 200ms. We tracked a temporary anomaly of **310ms** around 14:02 UTC when a customer database requested bulk image indexing. Everything returned to normal within 4 minutes.";
        } else if (lower.includes("project") || lower.includes("team") || lower.includes("task") || lower.includes("sarah")) {
          answer = "We are currently tracking **5 engineering projects**. The **AI Core Gateway** (managed by Sarah Chen) is at **85% completion** and on track for next Tuesday's shipment. Meanwhile, **Enterprise Workspace SSO** is experiencing slight delays due to custom SAML metadata issues, sitting at **40% completion**.";
        } else {
          answer = `Hello! I am your **Nexus AI SaaS Telemetry Analyst**. I can answer specific questions regarding financial metrics, project milestones, developer productivity, and AI API performance.

Here are some metrics I am tracking in your active environment:
- 📊 **Financials**: Monthly Recurring Revenue (**$142.5K**), AI API Expenditure (**$14.2K**).
- ⚡ **Telemetry**: Avg Latency (**142ms**), Database Success Rate (**99.96%**).
- 👥 **Team Coordination**: **5 active projects**, **12 engineers**, **18 backlog items**.

Feel free to ask me specifics, or try querying: *"How is AI Core Gateway doing?"* or *"Analyze our latest API costs"*!`;
        }
        return res.json({ success: true, answer, isSimulated: true });
      }

      const systemPrompt = `You are Nexus, an elite server-side AI Business and Systems Telemetry Analyst.
      Your tone is elegant, direct, clear, and analytical. You reside inside a high-end cloud SaaS app dashboard tracking metrics.
      
      You have access to the current system facts:
      - Monthly Recurring Revenue (MRR): $142,500 (+8.2% MoM)
      - Active Users: 12,450 Daily Active Users (DAU)
      - Active Paid Customers: 1,842 (Enterprise: 42, Growth: 450, Starter: 1,350)
      - Core performance metrics: average AI API latency is 142ms, incident rate: 0, API pipeline success rate: 99.96%
      - Expenditures: AI operation costs: $14,200 (budget limit is $15,000)
      - Key Active Projects: 
        1. "AI Core Gateway" (85% complete, Lead: Sarah Chen, Priority: High)
        2. "Enterprise Workspace SSO" (40% complete, Lead: Alex Mercer, Priority: Medium)
        3. "Analytics Export SDK v2" (100% completed, shipped yesterday)
      - Team metrics: 8 software developers, 2 UI/UX designers, 1 product manager. 18 backlog tickets total.
      
      Respond to the user's questions about metrics, SaaS performance, project health, cost, or team organization with professional, data-driven, elegant Markdown-formatted answers. Keep responses concise and focused.`;

      const formattedContents: any[] = [];
      if (history && Array.isArray(history)) {
        for (const msgPair of history) {
          formattedContents.push({
            role: msgPair.role === "user" ? "user" : "model",
            parts: [{ text: msgPair.text }]
          });
        }
      }
      formattedContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: systemPrompt
        }
      });

      res.json({ success: true, answer: response.text || "No response generated.", isSimulated: false });
    } catch (err: any) {
      console.error("Gemini API Chat error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- Vite Dev Middleware or Dist Serving ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
