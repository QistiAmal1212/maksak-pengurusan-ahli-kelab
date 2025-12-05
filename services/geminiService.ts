import { GoogleGenAI } from "@google/genai";
import { DashboardStats, Club, Member } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists to prevent crash on start, handle in function
const getAI = () => new GoogleGenAI({ apiKey });

export const generateExecutiveSummary = async (
  stats: DashboardStats, 
  clubs: Club[],
  members: Member[]
): Promise<string> => {
  if (!apiKey) return "API Key not configured. Please set process.env.API_KEY.";

  const ai = getAI();
  
  // Prepare a prompt with context
  const prompt = `
    You are an AI analyst for a Membership Management System (Sistem Pengurusan Keahlian).
    Analyze the following JSON data and provide an executive summary (in Bahasa Melayu and English).
    
    Data:
    - Total Members: ${stats.totalMembers}
    - Active: ${stats.activeMembers}
    - Pending: ${stats.pendingMembers}
    - Total Clubs: ${stats.totalClubs}
    - Clubs Data: ${JSON.stringify(clubs.map(c => c.name))}
    - Recent Usage Activity: ${JSON.stringify(stats.recentLogs)}

    Please provide:
    1. A summary of current membership health.
    2. Observations on recent activity.
    3. Recommendations for the club committee to improve engagement.
    
    Keep it professional and concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating insights. Please try again later.";
  }
};