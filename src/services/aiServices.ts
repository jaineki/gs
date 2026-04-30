// src/services/aiService.ts
export class AIService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = process.env.CUSTOM_API_URL || 'https://pasayloakomego.onrender.com/api/toolbot/api/chat';
        console.log(`✅ Using custom AI API: ${this.apiUrl}`);
    }

    private getSystemPrompt(): string {
        return `You are Selov AI, a helpful, faith-driven assistant for Jay Bohol's portfolio.
You are knowledgeable about Jay's skills: JavaScript, Python, Node.js, SQL/NoSQL, HTML5, CSS3.
You represent Jay Bohol, a builder and automation engineer who believes "God is good, nothing is impossible."
Keep responses concise (under 150 words), friendly, and encouraging.`;
    }

    async generateResponse(userQuery: string): Promise<string> {
        try {
            // Call your custom API endpoint
            const response = await fetch(`${this.apiUrl}?query=${encodeURIComponent(userQuery)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }

            const data = await response.json();
            
            // Handle different response formats from your API
            let aiResponse = '';
            if (typeof data === 'string') {
                aiResponse = data;
            } else if (data.response) {
                aiResponse = data.response;
            } else if (data.reply) {
                aiResponse = data.reply;
            } else if (data.message) {
                aiResponse = data.message;
            } else if (data.result) {
                aiResponse = data.result;
            } else {
                aiResponse = this.getFallbackResponse(userQuery);
            }

            return aiResponse;
        } catch (error) {
            console.error('Custom API error:', error);
            return this.getFallbackResponse(userQuery);
        }
    }

    private getFallbackResponse(query: string): string {
        const lowerQuery = query.toLowerCase();
        
        const responses: Record<string, string> = {
            skill: "I'm skilled in JavaScript, Python, Node.js, SQL/NoSQL, HTML5, and CSS3! Always learning and growing. Want to know more about any specific skill? 🚀",
            project: "I've built an AI Automation bot (Autobot) and an Auto Share Boost tool. Both are live and working! You can check them out in the projects section. 💻",
            faith: "God is good! I believe nothing is impossible with faith. It's my foundation and what drives me to keep building and creating. ✝️",
            contact: "You can reach me on Facebook (quart.hade) or Discord (goatbot61). I'll get back to you as soon as I can! 📱",
            hello: "Hey there! Great to meet you. I'm Selov AI, Jay's virtual assistant. Ask me about his skills, projects, or anything else! 👋"
        };

        for (const [key, response] of Object.entries(responses)) {
            if (lowerQuery.includes(key)) {
                return response;
            }
        }

        return "Thanks for reaching out! I'm here to help. Ask me about my skills (JavaScript, Python, Node.js), projects (Autobot, Auto Share), or my faith journey. What would you like to know? 🙏";
    }
}
