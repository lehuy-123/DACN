export async function POST(req) {
  try {
    const { message } = await req.json();

  if (!process.env.OPENAI_API_KEY) {

      throw new Error("Thiếu OPENROUTER_API_KEY trong .env.local");
    }

    const completion = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        // ✅ OpenRouter yêu cầu thêm 2 header phụ (User-Agent & HTTP-Referer)
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3001", 
        "X-Title": "FutaBus Chat AI" 
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // hoặc "mistralai/mistral-7b-instruct" (free hơn)
        messages: [
          {
            role: "system",
            content: "Bạn là trợ lý ảo FutaBus clone, hỗ trợ người dùng đặt vé, xem chuyến, khuyến mãi, v.v.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await completion.json();

    // ✅ Bắt trường hợp OpenRouter trả lỗi rõ ràng. 
    if (data.error) {
      console.error("❌ Lỗi OpenRouter:", data.error);
      return Response.json({ error: data.error.message || "Lỗi từ OpenRouter" }, { status: 500 });
    }

    // ✅ Một số model trả về dạng khác nhau
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      data?.output_text?.trim() ||
      "Không có phản hồi từ AI.";

    return Response.json({ reply });
  } catch (error) {
    console.error("❌ Lỗi API:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
