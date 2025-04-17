import { GoogleGenerativeAI } from '@google/generative-ai';
import { type NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';

const googleAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY!
);
const MODEL_NAME = 'gemini-2.0-flash-thinking-exp-01-21';
const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { startLocation, destination, preferences } = await request.json();

    if (!startLocation || !destination) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const geminiModel = googleAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = constructTripPlanningPrompt(
      startLocation,
      destination,
      preferences
    );

    const [resultResponse, imageUrlResponse] = await Promise.all([
      geminiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 1,
          topP: 0.1,
        }
      }),
      fetchDestinationImage(destination)
    ]);

    const text = resultResponse.response.text().trim();
    console.log('API response:', text.substring(0, 100));

    let tripPlan;
    if (text.startsWith('{')) {
      try {
        tripPlan = JSON.parse(text);
      } catch {
        tripPlan = parseTripPlanFromText(text);
      }
    } else {
      tripPlan = parseTripPlanFromText(text);
    }

    const imageUrl = imageUrlResponse;
    console.log('Fetched image URL:', imageUrl);

    tripPlan.image = imageUrl;
    tripPlan.duration = preferences.duration;
    tripPlan.transportType = preferences.transportationType;

    return NextResponse.json({
      tripPlan,
      rawResponse: text
    });
  } catch (error) {
    console.error('Error in trip planning:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
async function fetchDestinationImage(destination: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        destination + ' travel'
      )}&per_page=1&orientation=landscape`,
      {
        headers: { Authorization: PEXELS_API_KEY },
        signal: controller.signal
      }
    );

    clearTimeout(timeout);
    if (!response.ok)
      throw new Error(`Pexels API responded with status: ${response.status}`);
    const data = await response.json();
    return data.photos?.[0]?.src?.large ?? '';
  } catch (error) {
    console.error('Pexels error:', error);
    return '';
  }
}

function constructTripPlanningPrompt(
  startLocation: string,
  destination: string,
  preferences: TripPreferences
): string {
  const {
    budget = 'średni',
    duration = '7 dni',
    interests = [],
    travelStyle = 'standardowy',
    transportationType = 'dowolny'
  } = preferences;

  return `Zaplanuj podróż z ${startLocation} do ${destination}.

DANE PODRÓŻY:
- Miejsce startu: ${startLocation}
- Cel podróży: ${destination}
- Budżet: ${budget}
- Czas trwania: ${duration}
- Zainteresowania: ${interests.join(', ') || 'różnorodne atrakcje'}
- Styl podróżowania: ${travelStyle}
- Preferowany transport: ${transportationType}

Zwróć szczegółowy plan podróży w następującym formacie (każda sekcja powinna być sformatowana z użyciem markdown dla lepszej czytelności):

1. PODSUMOWANIE TRASY: Krótki opis trasy podróży, główne punkty i ogólne zalecenia.
2. TRANSPORT: Najlepsze opcje transportu między lokalizacjami (samolot, pociąg, autobus, samochód) z przybliżonymi cenami i czasem podróży.
3. PLAN DZIENNY: Szczegółowy plan dla każdego dnia podróży, zawierający miejsca do odwiedzenia, atrakcje i rekomendowane lokalne doświadczenia.
4. NOCLEGI: Rekomendowane miejsca pobytu w różnych przedziałach cenowych.
5. LOKALNA KUCHNIA: Polecane dania i restauracje warte odwiedzenia.
6. PORADY PRAKTYCZNE: Wskazówki dotyczące lokalnej kultury, transportu, bezpieczeństwa i innych praktycznych aspektów.
7. SZACOWANY BUDŻET: Przybliżony koszt całej podróży z podziałem na główne kategorie.

Każda sekcja powinna być wyraźnie oznaczona numerem i tytułem (np. "1. PODSUMOWANIE TRASY:"), a następnie zawierać szczegółowe informacje. Używaj formatowania markdown (## dla nagłówków, * dla punktów listy, ** dla wyróżnień).

Stwórz szczegółowy, praktyczny plan podróży oparty na tych informacjach. Zadbaj żeby wszystkie pola zostały wypełnione i żadne nie zostało puste. Użyj języka polskiego i zachowaj formatowanie. Nie dodawaj żadnych dodatkowych informacji ani komentarzy. Możesz w niektórych miejscach dodać emotki.

OPCJONALNIE: Jeśli wolisz, możesz zwrócić odpowiedź jako poprawny obiekt JSON o następującej strukturze:
{
  "summary": "tekst w formacie markdown",
  "transportation": "tekst w formacie markdown",
  "dailyPlans": "tekst w formacie markdown",
  "accommodation": "tekst w formacie markdown",
  "localCuisine": "tekst w formacie markdown",
  "practicalTips": "tekst w formacie markdown",
  "estimatedBudget": "tekst w formacie markdown"
}`;
}

function parseTripPlanFromText(text: string): TripPlan {
  const sectionTitles = [
    'PODSUMOWANIE TRASY',
    'TRANSPORT',
    'PLAN DZIENNY',
    'NOCLEGI',
    'LOKALNA KUCHNIA',
    'PORADY PRAKTYCZNE',
    'SZACOWANY BUDŻET'
  ];

  const sectionMap: Record<string, string> = {};

  sectionTitles.forEach(title => {
    sectionMap[title] = '';
  });

  const sectionRegex = /(\d+\.\s+(.*?)(?::|$))/g;
  const sectionHeaders = [...text.matchAll(sectionRegex)].map(match => ({
    fullMatch: match[0],
    title: match[2].trim()
  }));

  for (let i = 0; i < sectionHeaders.length; i++) {
    const currentHeader = sectionHeaders[i];
    const nextHeader = sectionHeaders[i + 1];

    const startPos =
      text.indexOf(currentHeader.fullMatch) + currentHeader.fullMatch.length;

    const endPos = nextHeader
      ? text.indexOf(nextHeader.fullMatch)
      : text.length;

    if (startPos < endPos) {
      const content = text.substring(startPos, endPos).trim();

      const matchingTitle = sectionTitles.find(title =>
        currentHeader.title.includes(title)
      );

      if (matchingTitle) {
        sectionMap[matchingTitle] = content;
      }
    }
  }

  if (Object.values(sectionMap).every(val => val === '')) {
    const markdownSections = text.split(/##\s+/);

    for (const section of markdownSections) {
      if (!section.trim()) continue;

      const firstLine = section.split('\n')[0].trim();
      const content = section.substring(firstLine.length).trim();

      for (const title of sectionTitles) {
        if (firstLine.toUpperCase().includes(title)) {
          sectionMap[title] = content;
          break;
        }
      }
    }
  }

  const tripPlan: TripPlan = {
    summary: sectionMap['PODSUMOWANIE TRASY'],
    transportation: sectionMap['TRANSPORT'],
    dailyPlans: sectionMap['PLAN DZIENNY'],
    accommodation: sectionMap['NOCLEGI'],
    localCuisine: sectionMap['LOKALNA KUCHNIA'],
    practicalTips: sectionMap['PORADY PRAKTYCZNE'],
    estimatedBudget: sectionMap['SZACOWANY BUDŻET'],
    image: '',
    duration: '',
    transportType: '',
    rawContent: text
  };

  return tripPlan;
}

interface TripPreferences {
  budget?: string;
  duration?: string;
  interests?: string[];
  travelStyle?: string;
  transportationType?: string;
}

interface TripPlan {
  summary: string;
  dailyPlans: string;
  transportation: string;
  accommodation: string;
  localCuisine: string;
  practicalTips: string;
  estimatedBudget: string;
  image: string;
  duration: string;
  transportType: string;
  rawContent: string;
}
