// Translation service with multiple providers and fallbacks
interface TranslationResponse {
  success: boolean
  translatedText: string
  provider: string
  error?: string
}

// Simple dictionary-based translations for common words/phrases
const translations: Record<string, Record<string, string>> = {
  "hello": {
    "Chinese": "你好",
    "Spanish": "Hola",
    "French": "Bonjour",
    "German": "Hallo",
    "Italian": "Ciao",
    "Portuguese": "Olá",
    "Japanese": "こんにちは",
    "Korean": "안녕하세요",
    "Russian": "Привет",
    "Arabic": "مرحبا"
  },
  "hello world": {
    "Chinese": "你好世界",
    "Spanish": "Hola mundo",
    "French": "Bonjour le monde",
    "German": "Hallo Welt",
    "Italian": "Ciao mondo",
    "Portuguese": "Olá mundo",
    "Japanese": "こんにちは世界",
    "Korean": "안녕하세요 세계",
    "Russian": "Привет мир",
    "Arabic": "مرحبا بالعالم"
  },
  "thank you": {
    "Chinese": "谢谢",
    "Spanish": "Gracias",
    "French": "Merci",
    "German": "Danke",
    "Italian": "Grazie",
    "Portuguese": "Obrigado",
    "Japanese": "ありがとう",
    "Korean": "감사합니다",
    "Russian": "Спасибо",
    "Arabic": "شكرا"
  },
  "good morning": {
    "Chinese": "早上好",
    "Spanish": "Buenos días",
    "French": "Bonjour",
    "German": "Guten Morgen",
    "Italian": "Buongiorno",
    "Portuguese": "Bom dia",
    "Japanese": "おはよう",
    "Korean": "좋은 아침",
    "Russian": "Доброе утро",
    "Arabic": "صباح الخير"
  },
  "yes": {
    "Chinese": "是",
    "Spanish": "Sí",
    "French": "Oui",
    "German": "Ja",
    "Italian": "Sì",
    "Portuguese": "Sim",
    "Japanese": "はい",
    "Korean": "네",
    "Russian": "Да",
    "Arabic": "نعم"
  },
  "no": {
    "Chinese": "不",
    "Spanish": "No",
    "French": "Non",
    "German": "Nein",
    "Italian": "No",
    "Portuguese": "Não",
    "Japanese": "いいえ",
    "Korean": "아니요",
    "Russian": "Нет",
    "Arabic": "لا"
  }
}

// Try dictionary-based translation first
function tryDictionaryTranslation(text: string, targetLanguage: string): string | null {
  const normalizedText = text.toLowerCase().trim()
  
  // Direct match
  if (translations[normalizedText] && translations[normalizedText][targetLanguage]) {
    return translations[normalizedText][targetLanguage]
  }
  
  // Try to find partial matches for simple phrases
  for (const [key, langMap] of Object.entries(translations)) {
    if (normalizedText.includes(key) && langMap[targetLanguage]) {
      // For simple replacements
      if (normalizedText === key) {
        return langMap[targetLanguage]
      }
    }
  }
  
  return null
}

// LibreTranslate API (free, open-source translation service)
async function tryLibreTranslate(text: string, targetLanguage: string): Promise<TranslationResponse> {
  try {
    // Map our language names to LibreTranslate language codes
    const languageMap: Record<string, string> = {
      "Chinese": "zh",
      "Spanish": "es", 
      "French": "fr",
      "German": "de",
      "Italian": "it",
      "Portuguese": "pt",
      "Japanese": "ja",
      "Korean": "ko",
      "Russian": "ru",
      "Arabic": "ar"
    }
    
    const targetCode = languageMap[targetLanguage] || targetLanguage.toLowerCase()
    
    console.log(`Trying LibreTranslate translation to ${targetCode}...`)
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetCode,
        format: 'text'
      }),
      timeout: 15000 // 15 second timeout
    } as any)
    
    if (response.ok) {
      const data = await response.json() as any
      console.log('LibreTranslate response:', data)
      
      if (data.translatedText && data.translatedText.trim()) {
        const translatedText = data.translatedText.trim()
        // Check if the translation is meaningful (not just returning the original text)
        if (translatedText.toLowerCase() !== text.toLowerCase()) {
          return {
            success: true,
            translatedText,
            provider: 'LibreTranslate'
          }
        }
      }
    }
    
    throw new Error(`LibreTranslate API error: ${response.status} ${response.statusText}`)
  } catch (error) {
    console.log('LibreTranslate translation failed:', error)
    return {
      success: false,
      translatedText: text,
      provider: 'LibreTranslate',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// MyMemory Translation API (free)
async function tryMyMemoryTranslate(text: string, targetLanguage: string): Promise<TranslationResponse> {
  try {
    const languageMap: Record<string, string> = {
      "Chinese": "zh-CN",
      "Spanish": "es",
      "French": "fr", 
      "German": "de",
      "Italian": "it",
      "Portuguese": "pt",
      "Japanese": "ja",
      "Korean": "ko",
      "Russian": "ru",
      "Arabic": "ar"
    }
    
    const targetCode = languageMap[targetLanguage] || targetLanguage.toLowerCase()
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetCode}`
    
    console.log(`Trying MyMemory translation to ${targetCode}...`)
    const response = await fetch(url, {
      timeout: 10000 // 10 second timeout
    } as any)
    
    if (response.ok) {
      const data = await response.json() as any
      console.log('MyMemory response:', data)
      
      if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
        const translatedText = data.responseData.translatedText.trim()
        // Check if the translation is meaningful (not just returning the original text)
        if (translatedText && translatedText.toLowerCase() !== text.toLowerCase()) {
          return {
            success: true,
            translatedText,
            provider: 'MyMemory'
          }
        }
      }
    }
    
    throw new Error(`MyMemory API error: ${response.status} ${response.statusText}`)
  } catch (error) {
    console.log('MyMemory translation failed:', error)
    return {
      success: false,
      translatedText: text,
      provider: 'MyMemory',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Main translation function with fallbacks
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!text || !text.trim()) {
    throw new Error('Text is required for translation.')
  }

  if (!targetLanguage || !targetLanguage.trim()) {
    throw new Error('Target language is required for translation.')
  }

  // Clean the input text - remove any existing translation prefixes to prevent duplication
  let cleanText = text.trim()
  const prefixPattern = /^\[.*?\s+translation\]:\s*/i
  if (prefixPattern.test(cleanText)) {
    cleanText = cleanText.replace(prefixPattern, '').trim()
    console.log(`Removed existing translation prefix. Clean text: ${cleanText}`)
  }

  // Step 1: Try dictionary translation for simple phrases
  const dictionaryResult = tryDictionaryTranslation(cleanText, targetLanguage)
  if (dictionaryResult) {
    console.log(`Dictionary translation successful: ${cleanText} -> ${dictionaryResult}`)
    return dictionaryResult
  }

  // Step 2: Try free online translation services
  console.log(`Attempting online translation: ${cleanText} to ${targetLanguage}`)
  
  // Try MyMemory first (usually faster)
  const myMemoryResult = await tryMyMemoryTranslate(cleanText, targetLanguage)
  if (myMemoryResult.success) {
    console.log(`MyMemory translation successful: ${myMemoryResult.translatedText}`)
    return myMemoryResult.translatedText
  }
  
  // Try LibreTranslate as backup
  const libreResult = await tryLibreTranslate(cleanText, targetLanguage)
  if (libreResult.success) {
    console.log(`LibreTranslate translation successful: ${libreResult.translatedText}`)
    return libreResult.translatedText
  }
  
  // Step 3: Final fallback - provide error message instead of broken prefix
  console.log(`All translation methods failed. Translation services may be unavailable.`)
  throw new Error(`Translation services are currently unavailable. Please try again later or check your internet connection.`)
}