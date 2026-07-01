import { MODEL_NAME, SYSTEM_PROMPT, getGeminiClient } from "@/lib/gemini";
import { AnalysisResult } from "@/types/analysis";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return Response.json(
        { error: "Tidak ada file gambar yang dikirimkan." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        {
          error: "File yang dikirimkan bukan gambar.",
          detail: `Tipe file: ${file.type}`,
        },
        { status: 415 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return Response.json(
        {
          error: "Ukuran file terlalu besar. Maksimum 10MB.",
          detail: `Ukuran file: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        },
        { status: 413 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    // Call Gemini Vision API
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type as
            | "image/jpeg"
            | "image/png"
            | "image/webp"
            | "image/gif",
          data: base64Data,
        },
      },
      {
        text: "Analisis citra daun atau buah tanaman ini sesuai dengan peranmu sebagai Dr. Botanica. Berikan respons JSON murni.",
      },
    ]);

    const responseText = result.response.text();

    // Strip markdown code fences if model ignores the instruction
    const cleanedText = responseText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let analysisResult: AnalysisResult;
    try {
      analysisResult = JSON.parse(cleanedText);
    } catch {
      console.error("Failed to parse Gemini response:", cleanedText);
      return Response.json(
        {
          error:
            "Gagal memproses respons dari AI. Model tidak mengembalikan format JSON yang valid.",
          detail: cleanedText.substring(0, 200),
        },
        { status: 422 }
      );
    }

    return Response.json(analysisResult);
  } catch (error: unknown) {
    console.error("Analyze API error:", error);

    // Extract HTTP status from Gemini SDK error object
    const geminiError = error as {
      status?: number;
      message?: string;
    };
    const status = geminiError?.status;

    if (status === 429) {
      return Response.json(
        {
          error: "Batas kuota API Gemini tercapai.",
          detail:
            "Kuota penggunaan gratis Anda sudah habis. Silakan tunggu beberapa menit lalu coba lagi, atau upgrade plan di https://aistudio.google.com.",
        },
        { status: 429 }
      );
    }

    if (status === 400) {
      return Response.json(
        {
          error: "API Key Gemini tidak valid.",
          detail:
            "Pastikan GEMINI_API_KEY di file .env.local sudah diisi dengan key yang benar dari https://aistudio.google.com/app/apikey, lalu restart server.",
        },
        { status: 400 }
      );
    }

    if (status === 404) {
      return Response.json(
        {
          error: "Model AI tidak ditemukan.",
          detail: `Model ${MODEL_NAME} tidak tersedia untuk API key ini. Coba buat API key baru di https://aistudio.google.com/app/apikey pada project baru.`,
        },
        { status: 404 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga";
    return Response.json(
      { error: "Terjadi kesalahan pada server.", detail: message },
      { status: 500 }
    );
  }
}
