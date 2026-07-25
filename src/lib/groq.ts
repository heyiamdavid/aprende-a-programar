export const getCodeReview = async (code: string, challenge: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    return "Error: No se ha configurado VITE_GROQ_API_KEY en las variables de entorno.";
  }

  const prompt = `Eres un profesor experto en Python y principios SOLID de programación.
Revisa el siguiente código del estudiante. 
El reto actual es: "${challenge}". 
Por favor, sé breve, amigable, claro y da consejos prácticos sobre cómo mejorar el código, aplicando buenas prácticas y principios SOLID si aplica.

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
        model: "llama-3.1-8b-instant", // Usando el modelo actual soportado por Groq
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Groq API Error Response:", errData);
      return `Error en la API de Groq (${response.status}): ${errData.error?.message || response.statusText}`;
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No se recibió respuesta de la IA.";
  } catch (error: any) {
    console.error("Groq Error:", error);
    return `Hubo un problema al conectar con la IA: ${error.message || error}`;
  }
};
