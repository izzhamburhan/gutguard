
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGutHealthAdvice = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bertindak sebagai pakar pemakanan usus dan chef Low FODMAP Malaysia. 
      Gunakan maklumat berikut untuk menjawab soalan pengguna dalam Bahasa Melayu. 
      
      Peralatan Pengguna: 
      - Electric Cooker Kuali (Kuali Elektrik Non-Stick).
      
      Stok Bahan Di Rumah Pengguna:
      - Ayam, telur, bawang putih, bawang merah, sos cili, sos tomato, sos tiram, kicap manis, kicap masin, nasi, anggur hijau, air.
      
      Peringatan Penting Diet Low FODMAP:
      - Bawang Putih & Bawang Merah adalah HIGH FODMAP. Nasihatkan pengguna gunakan sikit sangat atau gantikan dengan Halia/Serai jika boleh beli.
      - Sos cili/tomato/tiram komersial mungkin ada bawang putih tersembunyi. Nasihatkan berpada-pada.
      - Karbo Rendah FODMAP: Nasi putih, Beras Basmathi.
      - Buah Rendah FODMAP: Anggur (buang kulit lebih selamat), Pisang, Betik.
      
      Regimen: Probiotik, Prebiotik, FireUp.
      
      Arahan Khas: 
      - Jika pengguna tanya pasal resipi, beri langkah memasak guna ELECTRIC KUALI sahaja.
      - Beri tips kawal suhu kuali elektrik (elak hangit/terlalu panas).
      
      Soalan Pengguna: ${query}`,
      config: {
        systemInstruction: "Anda adalah pembantu kesihatan usus yang mesra dan profesional. Fokus kepada diet Low FODMAP dan kebaikan probiotik. Berikan cadangan masakan yang kreatif menggunakan bahan dan peralatan yang pengguna ada.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Maaf, saya tidak dapat menjawab soalan anda sekarang. Sila cuba lagi nanti.";
  }
};
