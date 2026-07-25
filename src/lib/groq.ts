export const getCodeReview = async (code: string, challenge: string, consoleOutput: string = ""): Promise<string> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    return "Error: No se ha configurado VITE_GROQ_API_KEY en las variables de entorno.";
  }

  const prompt = `Eres un profesor experto en Python, Arquitectura de Software, y Programación Orientada a Objetos (POO).
El estudiante está intentando resolver el reto: "${challenge}".

Actúa como un mentor estricto pero amable:
1. Evalúa si el código aplica correctamente principios SOLID y buenas prácticas de POO.
2. Si la consola tiene ERRORES (Tracebacks), explica exactamente en qué línea falló y por qué ocurrió.
3. Si el código no tiene errores, señala qué cosas están bien y qué se podría refactorizar para ser más limpio.

Código del estudiante:
\`\`\`python
${code}
\`\`\`

Salida de la Consola (lo que vio el estudiante al ejecutar):
\`\`\`
${consoleOutput.trim() || "No se detectó salida en la consola (quizás no imprimió nada o no lo ejecutó)."}
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
