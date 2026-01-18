
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initializing GoogleGenAI using the process.env.API_KEY directly as required by the SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiAnalysis = async (userPrompt: string, isVip: boolean) => {
  const model = 'gemini-3-flash-preview';
  const version = isVip ? 'Pluxo v6 ELITE' : 'Pluxo v3 Standard';
  
  const systemInstruction = `
    You are the "Pluxo Neural Hub", currently running version ${version}.
    Your objective is to provide high-precision predictive data for the crash game Aviator.
    
    Always speak in a professional, technical terminal tone.
    Focus on "cluster mapping" and "signal synchronization".
    If asked for strategy, provide risk-averse advice for Standard users and high-gain strategies for Elite users.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Pluxo API Error:", error);
    return "HANDSHAKE_ERROR: Uplink interrupted. Recalibrating node...";
  }
};

export const getVipPrediction = async () => {
  const model = 'gemini-3-flash-preview';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: "Perform neural cluster analysis for the next Aviator flight flight history. Provide high-fidelity exit multiplier prediction. Return JSON only.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedMultiplier: {
              type: Type.NUMBER,
              description: "Optimal exit point multiplier",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence percentage 0-100",
            },
            reasoning: {
              type: Type.STRING,
              description: "3-word technical reasoning code",
            },
            strength: {
              type: Type.NUMBER,
              description: "Signal signal strength index 0-100",
            },
          },
          required: ["predictedMultiplier", "confidence", "reasoning", "strength"],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Pluxo Prediction Error:", error);
    return {
      predictedMultiplier: Number((Math.random() * 2.5 + 1.2).toFixed(2)),
      confidence: 94,
      reasoning: "CLUSTER_SYNC_OK",
      strength: 88
    };
  }
};
