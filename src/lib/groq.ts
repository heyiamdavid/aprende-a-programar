export const getCodeReview = async (code: string, challenge: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Groq API Key");
  }

  const prompt = `Eres un profesor experto en Python y principios SOLID. 
Revisa el siguiente código del estudiante. 
El reto actual es: "${challenge}". 
Por favor, sé breve, amigable y da consejos sobre cómo mejorar el código, aplicando buenas prácticas.
Código del estudiante:
\`\`\`python
${code}
\`\`\`
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Modelo rápido de Groq
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 512
      })
    });

    if (!response.ok) {
      throw new Error(`Error en la API de Groq: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Groq Error:", error);
    return "Hubo un error al intentar analizar tu código. Por favor intenta de nuevo.";
  }
};
