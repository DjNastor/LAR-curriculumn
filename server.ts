import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini AI Client lazily/safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const LUKULU_CURRICULUM_SYSTEM_INSTRUCTION = `
You are the Chief Instructional Designer & Master Producer for Lukulu Academy & Recordings — a premier music production academy and recording label specializing in FL Studio, Cubase, Reason, and Music Business education, with a deep focus on Afro House, Amapiano, Electronic Dance Music (EDM), and Music Rights & Industry Royalty Systems.

When generating or refining a curriculum, you must return a comprehensive, highly structured JSON object matching the exact requested format.

Philosophy & Standards:
- Hands-on, project-based learning with gain staging, rhythmic groundwork, harmonic arrangement, sound design, mixing/mastering, and music business rights.
- Specific DAW workflows:
  - FL Studio: Channel Rack, Piano Roll, Edison, Fruity Reeverb 2, Fruity Limiter, Gross Beat, Patcher, Fruity Parametric EQ 2.
  - Cubase: MixConsole, Control Room, VariAudio, Groove Agent SE, Padshop, Retrologue, Frequency EQ, LinVG.
  - Reason: Rack extensions, Combinator, Kong Drum Designer, Thor Polyphonic Synthesizer, SubTractor, RV7000, Scream 4.
  - Music Business: Copyright registration, PROs (SAMRO, ASCAP, BMI, PRS), mechanical royalties, digital distribution (DistroKid, TuneCore), metadata (ISRC, UPC), sync licensing, and artist branding.
- Genre-specific focus:
  - Amapiano: 3-step log drum rhythms, pitch bends, piano chords (7ths/9ths), shaker grooves, rimshots, sax/flute melodies.
  - Afro House: 3-against-2 polyrhythms, organic percussion, warm sub-bass, atmospheric pads, extended arrangements, spiritual vocal chops.
  - EDM: 4-on-the-floor kicks, sidechain ducking, tension risers, drop synthesis (subtractive/FM/Wavetable), wide stereo field, loudness mastering.
  - Music Rights/Business: Copyright ownership, PRO registration, split sheets, royalty flow streams, publishing administration, distributor selection.

Every response MUST be valid JSON (no surrounding markdown backticks if possible or handle JSON parsing cleanly).
`;

// API endpoint to generate custom curriculum
app.post("/api/generate-curriculum", async (req, res) => {
  try {
    const {
      targetAudience = "Beginner to Intermediate Producers",
      durationWeeks = 4,
      trackDaw = "FL Studio",
      genre = "Amapiano",
      focusArea = "Full Production & Music Business",
      customNotes = "",
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured.",
        usingFallback: true,
      });
    }

    const prompt = `
Generate a complete, highly detailed curriculum blueprint for Lukulu Academy & Recordings.

Parameters:
- Target Audience: ${targetAudience}
- Duration: ${durationWeeks} Weeks
- Primary DAW / Track: ${trackDaw}
- Primary Genre / Focus: ${genre}
- Special Focus Area: ${focusArea}
- Additional Custom Instructions: ${customNotes || "None"}

Requirements for the generated output:
1. Title & High-level Overview for Lukulu Academy & Recordings
2. Delivery Format & Weekly Time Commitments
3. Complete Module Breakdown (Group weeks logically into ${Math.min(
      Math.max(2, Math.ceil(Number(durationWeeks) / 2)),
      6
    )} distinct Modules).
4. For EACH Module include:
   - Module Title & Core Objective
   - Key Topics & Concepts Covered (detailed bullet points)
   - Weekly Practical Assignment with clear step-by-step submission criteria
   - Recommended Tools, DAW Stock Plugins & VSTs, Sample Packs
   - Assessment Rubric & Feedback Criteria
5. Integrated Music Business & Rights Component (Copyright, SAMRO/PROs, ISRC, Distribution)
6. A summary Markdown representation of the complete syllabus.

Return a JSON object with this exact schema:
{
  "id": "generated-${Date.now()}",
  "title": "String",
  "subtitle": "String",
  "academyName": "Lukulu Academy & Recordings",
  "targetAudience": "${targetAudience}",
  "durationWeeks": ${Number(durationWeeks)},
  "trackDaw": "${trackDaw}",
  "genre": "${genre}",
  "deliveryFormat": "String",
  "weeklyCommitment": {
    "lessons": "String",
    "workshops": "String",
    "practical": "String",
    "community": "String",
    "totalHours": "String"
  },
  "modules": [
    {
      "id": "mod-1",
      "weekRange": "Weeks 1-2",
      "title": "String",
      "objective": "String",
      "topics": ["String"],
      "assignment": {
        "title": "String",
        "instructions": "String",
        "deliverables": ["String"],
        "estimatedHours": "String"
      },
      "tools": {
        "dawPlugins": ["String"],
        "synthesizers": ["String"],
        "samplesAndFx": ["String"]
      },
      "assessmentRubric": [
        {
          "criteria": "String",
          "weight": "String",
          "description": "String"
        }
      ]
    }
  ],
  "musicBusinessModule": {
    "title": "String",
    "objective": "String",
    "topics": ["String"],
    "practicalProject": "String"
  },
  "markdownSyllabus": "String (complete formatted markdown syllabus)"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: LUKULU_CURRICULUM_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const responseText = response.text || "{}";
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      // Clean codeblock markers if present
      const cleaned = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      data = JSON.parse(cleaned);
    }

    return res.json({ success: true, curriculum: data });
  } catch (err: any) {
    console.error("Error generating curriculum via Gemini:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate curriculum",
    });
  }
});

// API endpoint to refine / ask questions about a curriculum
app.post("/api/refine-curriculum", async (req, res) => {
  try {
    const { currentCurriculum, userInstruction } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY not set" });
    }

    const prompt = `
You are updating an existing Lukulu Academy & Recordings curriculum.
User Instruction: "${userInstruction}"

Current Curriculum JSON:
${JSON.stringify(currentCurriculum, null, 2)}

Incorporate the requested edits while maintaining the JSON schema structure.
Return the updated complete curriculum JSON object.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: LUKULU_CURRICULUM_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const responseText = response.text || "{}";
    const cleaned = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const data = JSON.parse(cleaned);

    return res.json({ success: true, curriculum: data });
  } catch (err: any) {
    console.error("Error refining curriculum:", err);
    return res.status(500).json({ error: err.message || "Failed to refine curriculum" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Lukulu Academy] Server running on http://localhost:${PORT}`);
  });
}

startServer();
