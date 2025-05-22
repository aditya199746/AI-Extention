import axios from "axios";
import keys from "../../../keys.json"

export const summarizeText = async (text: string, category: "blog" | "video" | "news") => {
  try {
    const prompt = `
    Summarize the following ${category} content while understanding its emotion and context:\n\n${text}`;

    const apiKey = keys.googleapis;
    const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    }
  );
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error("Summarization API failed:", error);
    return "Error fetching summary.";
  }
};

export const audioToText = async (audioUrl: string) => {
  const baseUrl = "https://api.assemblyai.com";
  const headers = {
    authorization: keys.assemblyai,
  };

  const data = {
    audio_url: audioUrl,
    speech_model: "universal",
  };

  const url = `${baseUrl}/v2/transcript`;
  const response = await axios.post(url, data, { headers });

  const transcriptId = response.data.id;
  const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;

  while (true) {
    const pollingResponse = await axios.get(pollingEndpoint, { headers });
    const transcriptionResult = pollingResponse.data;

    if (transcriptionResult.status === "completed") {
      return transcriptionResult.text;
    } else if (transcriptionResult.status === "error") {
      throw new Error(`Transcription failed: ${transcriptionResult.error}`);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};