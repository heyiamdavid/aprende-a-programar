// Helper to trim code to avoid token waste
const trimCode = (code: string, max = 2500) =>
  code.length > max ? code.slice(0, max) + '\n# ... (código recortado)' : code;

export const getCodeReview = async (code: string, challenge: string, consoleOutput: string = ""): Promise<string> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    return "Error: No se ha configurado VITE_GROQ_API_KEY en las variables de entorno.";
  }

  // Compact prompt — save ~40% tokens vs previous version
  const prompt = `Eres mentor de programación. Reto: "${challenge}".
Evalúa el código del estudiante en máx 5 oraciones:
1. ¿Qué hizo bien y por qué es buena práctica?
2. ¿Qué puede mejorar o qué concepto le faltó aplicar?
3. Si usa tkinter, recúeïrdale que no corre en web pero evalúalo como correcto si la lógica es válida.
4. Si hay error en consola, explica por qué ocurrió.
Se breve, concreto, y motivador. No des la solución completa.

Código:
\`\`\`
${trimCode(code)}
\`\`\`
Consola: ${consoleOutput.trim().slice(0, 300) || 'Sin salida'}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Better quality for mentor feedback
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 400 // Reduced from 600
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

export const validateChallengeCompletion = async (code: string, challenge: string, instructions: string): Promise<{ success: boolean, feedback: string }> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    return { success: false, feedback: "Error: No se ha configurado VITE_GROQ_API_KEY en las variables de entorno." };
  }

  // Extract first 600 chars of instructions as summary to save tokens
  const instructionsSummary = instructions.slice(0, 600);

  const prompt = `Evaluador estricto de código. Reto: "${challenge}".
Requisitos clave del reto (resumen):
"""${instructionsSummary}"""

REGLAS DE RECHAZO INMEDIATO (success:false):
- Código basura, texto sin sentido, editor vacío o solo comentario TODO.
- No intenta resolver el problema planteado.
- Tkinter/GUI: evalúalo solo por estructura y lógica, no por ejecución.

Responde SOLO JSON válido:
{"success":true|false,"feedback":"explicación breve de máx 3 oraciones"}

Código:
\`\`\`
${trimCode(code, 2000)}
\`\`\``;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Fast & cheap for JSON validation
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 200, // Validation only needs a short answer
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      return { success: false, feedback: "Error conectando con la IA para evaluar." };
    }

    const data = await response.json();
    const resultText = data.choices[0]?.message?.content;
    try {
      const parsed = JSON.parse(resultText);
      return {
        success: !!parsed.success,
        feedback: parsed.feedback || "Evaluación completada sin comentarios adicionales."
      };
    } catch (e) {
      return { success: false, feedback: "La IA devolvió un formato inválido. Intenta de nuevo." };
    }
  } catch (error: any) {
    return { success: false, feedback: `Error de red: ${error.message}` };
  }
};
