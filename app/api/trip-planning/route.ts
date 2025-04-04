import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const googleAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY!
);
const MODEL_NAME = 'gemini-2.5-pro-exp-03-25';

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

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();
    const tripPlan = parseTripPlanFromText(text);

    return NextResponse.json({ tripPlan, rawResponse: text });
  } catch (error) {
    console.error('Error in trip planning:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
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

Zwróć szczegółowy plan podróży w następującym formacie:
1. PODSUMOWANIE TRASY: Krótki opis trasy podróży, główne punkty i ogólne zalecenia.
2. TRANSPORT: Najlepsze opcje transportu między lokalizacjami (samolot, pociąg, autobus, samochód) z przybliżonymi cenami i czasem podróży.
3. PLAN DZIENNY: Szczegółowy plan dla każdego dnia podróży, zawierający miejsca do odwiedzenia, atrakcje i rekomendowane lokalne doświadczenia.
4. NOCLEGI: Rekomendowane miejsca pobytu w różnych przedziałach cenowych.
5. LOKALNA KUCHNIA: Polecane dania i restauracje warte odwiedzenia.
6. PORADY PRAKTYCZNE: Wskazówki dotyczące lokalnej kultury, transportu, bezpieczeństwa i innych praktycznych aspektów.
7. SZACOWANY BUDŻET: Przybliżony koszt całej podróży z podziałem na główne kategorie.

Stwórz szczegółowy, praktyczny plan podróży oparty na tych informacjach. Zadbaj żeby wszystkie pola zostały wypełnione i żadne nie zostało puste. Użyj języka polskiego i zachowaj formatowanie. Nie dodawaj żadnych dodatkowych informacji ani komentarzy.`;
}

function parseTripPlanFromText(text: string): TripPlan {
  const sections = text.split(/\d+\.\s+/).filter(Boolean);

  const tripPlan: TripPlan = {
    summary: extractSection(sections[0] || '', 'PODSUMOWANIE TRASY'),
    transportation: extractSection(sections[1] || '', 'TRANSPORT'),
    dailyPlans: extractDailyPlans(sections[2] || ''),
    accommodation: extractSection(sections[3] || '', 'NOCLEGI'),
    localCuisine: extractSection(sections[4] || '', 'LOKALNA KUCHNIA'),
    practicalTips: extractSection(sections[5] || '', 'PORADY PRAKTYCZNE'),
    estimatedBudget: extractSection(sections[6] || '', 'SZACOWANY BUDŻET'),
    rawContent: text
  };

  return tripPlan;
}

function extractSection(text: string, sectionTitle: string): string {
  return text.replace(sectionTitle + ':', '').trim();
}

function extractDailyPlans(
  dailyPlansText: string
): Array<{ day: string; activities: string }> {
  const dailyPlansArray: Array<{ day: string; activities: string }> = [];

  const dayRegex = /Dzień (\d+):([\s\S]*?)(?=Dzień \d+:|$)/g;
  let match;

  while ((match = dayRegex.exec(dailyPlansText)) !== null) {
    dailyPlansArray.push({
      day: `Dzień ${match[1]}`,
      activities: match[2].trim()
    });
  }

  return dailyPlansArray;
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
  transportation: string;
  dailyPlans: Array<{ day: string; activities: string }>;
  accommodation: string;
  localCuisine: string;
  practicalTips: string;
  estimatedBudget: string;
  rawContent: string;
}
