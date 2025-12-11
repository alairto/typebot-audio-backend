import axios from "axios";
import FormData from "form-data";

export default async function handler(req, res) {
  const { audio_url } = req.body;

  try {
    const audio = await axios.get(audio_url, { responseType: "arraybuffer" });

    const form = new FormData();
    form.append("model", "gpt-4o-mini-transcribe");
    form.append("file", audio.data, {
      filename: "audio.webm",
      contentType: "audio/webm"
    });

    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      form,
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, ...form.getHeaders() } }
    );

    res.json({ transcricao: response.data.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar áudio" });
  }
}
