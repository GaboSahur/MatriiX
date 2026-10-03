import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

router.post("/claude-hint", async (req, res) => {
  try {
    const { tema, problema, respuestaIncorrecta, idioma = "es" } = req.body;

    const prompt = `
      Eres un profesor de matemática para niños y adolescentes.
      Debes responder en ${idioma}.
      Tema: ${tema}
      Problema: ${problema}
      Respuesta incorrecta: ${respuestaIncorrecta}

      Quiero una pista corta, útil y pedagógica.
      Debe explicar la idea sin dar la respuesta final.
      Máximo 2 frases.
    `;

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const respuesta =
      msg.content?.[0]?.type === "text"
        ? msg.content[0].text
        : "Pensá en la operación que te ayuda a resolver el problema paso a paso.";

    res.json({ pista: respuesta });
  } catch (error) {
    console.error("Error con Claude:", error);
    res.status(500).json({
      pista:
        "Revisá la operación y pensá cómo se relacionan los números entre sí.",
    });
  }
});
export { router };
