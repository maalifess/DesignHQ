import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

// ── Mood Board Analysis ────────────────────────────────────────────────────────
export async function analyzeMoodBoard(imageBase64Array: string[]): Promise<MoodBoardAnalysis[]> {
  const parts: any[] = [
    {
      text: `You are a fashion analysis AI. Analyze these mood board images and for each image return a JSON object with:
1. garment_type: string (dress, coat, trousers, blouse, suit, etc.)
2. style_aesthetic: string (minimalist, avant-garde, bohemian, romantic, edgy, etc.)
3. dominant_colors: string[] (hex codes, e.g. ["#8B0020","#F5E6E8"])
4. mood: string (romantic, edgy, ethereal, dramatic, playful, etc.)
5. season: string (SS/AW/Resort/All-season)

Return ONLY a valid JSON array. No markdown, no explanation.`,
    },
    ...imageBase64Array.map((b64) => ({
      inlineData: {
        mimeType: 'image/jpeg',
        data: b64,
      },
    })),
  ]

  const result = await model.generateContent(parts)
  const text = result.response.text().trim()

  try {
    const cleaned = text.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return []
  }
}

// ── Design Critique ────────────────────────────────────────────────────────────
export async function getDesignCritique(imageBase64: string): Promise<DesignCritique> {
  const result = await model.generateContent([
    {
      text: `You are an experienced fashion design professor reviewing a student's sketch. 
Analyze it and provide constructive, encouraging feedback in this exact JSON format:
{
  "works_well": ["point 1", "point 2", "point 3"],
  "improvements": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "overall": "A warm, supportive overall comment from a mentor's perspective."
}

Return ONLY valid JSON. No markdown.`,
    },
    {
      inlineData: {
        mimeType: 'image/png',
        data: imageBase64,
      },
    },
  ])

  const text = result.response.text().trim()
  try {
    const cleaned = text.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return {
      works_well: ['Your sketch shows clear creative vision.'],
      improvements: ['Consider adding more detail to the collar and cuffs.', 'The proportions could be refined.', 'Add fabric texture notes to the sketch.'],
      overall: 'A promising concept with room to develop further. Keep sketching!',
    }
  }
}

// ── Style Guide Generator ──────────────────────────────────────────────────────
export interface StyleGuideInput {
  theme: string
  season: string
  targetAudience: string
  moodKeywords: string
  colorDirection?: string
  garmentCategories: string[]
  inspirationRefs?: string
}

export async function generateStyleGuide(input: StyleGuideInput): Promise<StyleGuide> {
  const prompt = `You are a senior fashion design consultant helping a final-year fashion design student develop a collection style guide. 

Collection Input:
- Theme/Title: ${input.theme}
- Season: ${input.season}
- Target Audience: ${input.targetAudience}
- Mood Keywords: ${input.moodKeywords}
- Color Direction: ${input.colorDirection || 'Open to suggestion'}
- Garment Categories: ${input.garmentCategories.join(', ')}
- Inspiration References: ${input.inspirationRefs || 'None specified'}

Generate a complete style guide as valid JSON (no markdown) with this exact structure:
{
  "collection_name": "string",
  "tagline": "string",
  "mood_description": "Two paragraphs — poetic but grounded.",
  "color_palette": [
    {"name": "string", "hex": "#XXXXXX", "usage_note": "string"}
  ],
  "key_silhouettes": [
    {"name": "string", "description": "string"}
  ],
  "fabric_recommendations": [
    {"name": "string", "season": "string", "weight": "string", "texture": "string", "note": "string"}
  ],
  "key_design_details": ["detail 1", "detail 2", "detail 3", "detail 4", "detail 5"],
  "target_customer_profile": "string",
  "collection_story": "string"
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()
  try {
    const cleaned = text.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    throw new Error('Failed to parse style guide response')
  }
}

// ── Types ──────────────────────────────────────────────────────────────────────
export interface MoodBoardAnalysis {
  garment_type: string
  style_aesthetic: string
  dominant_colors: string[]
  mood: string
  season: string
}

export interface DesignCritique {
  works_well: string[]
  improvements: string[]
  overall: string
}

export interface StyleGuide {
  collection_name: string
  tagline: string
  mood_description: string
  color_palette: { name: string; hex: string; usage_note: string }[]
  key_silhouettes: { name: string; description: string }[]
  fabric_recommendations: { name: string; season: string; weight: string; texture: string; note: string }[]
  key_design_details: string[]
  target_customer_profile: string
  collection_story: string
}
