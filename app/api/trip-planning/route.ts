import { GoogleGenerativeAI } from '@google/generative-ai';
import { type NextRequest, NextResponse } from 'next/server';

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
    const text = result.response
      .text()
      .trim()
      .replace(/^\*+\s*/, '')
      .replace(/\s*\*+$/, '');

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

Stwórz szczegółowy, praktyczny plan podróży oparty na tych informacjach. Zadbaj żeby wszystkie pola zostały wypełnione i żadne nie zostało puste. Użyj języka polskiego i zachowaj formatowanie. Nie dodawaj żadnych dodatkowych informacji ani komentarzy. Możesz w niektórych miejsach dodać jakieś emotki.`;
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

  // Extract content between sections
  for (let i = 0; i < sectionHeaders.length; i++) {
    const currentHeader = sectionHeaders[i];
    const nextHeader = sectionHeaders[i + 1];

    // Find the start position (after the current header)
    const startPos =
      text.indexOf(currentHeader.fullMatch) + currentHeader.fullMatch.length;

    // Find the end position (before the next header or end of text)
    const endPos = nextHeader
      ? text.indexOf(nextHeader.fullMatch)
      : text.length;

    // Extract the content
    if (startPos < endPos) {
      const content = text.substring(startPos, endPos).trim();

      // Map the section title to our expected keys
      const matchingTitle = sectionTitles.find(title =>
        currentHeader.title.includes(title)
      );

      if (matchingTitle) {
        sectionMap[matchingTitle] = content;
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
  transportation: string;
  dailyPlans: string;
  accommodation: string;
  localCuisine: string;
  practicalTips: string;
  estimatedBudget: string;
  rawContent: string;
}
