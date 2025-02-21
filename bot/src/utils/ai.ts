interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIResponse {
  choices: {
    message: Message;
  }[];
}

export async function askAI(prompt: string): Promise<string> {
  try {
    const response = await fetch("https://ai.hackclub.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI request failed: ${response.statusText}`);
    }

    const data: AIResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI request error:", error);
    throw error;
  }
}
