import { GoogleGenerativeAI } from '@google/generative-ai';
import { type NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';

const googleAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY!
);
const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
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
          temperature: 0.05,
          topK: 1,
          topP: 0.1,
        }
      }),
      fetchDestinationImage(destination)
    ]);

    const text = resultResponse.response.text().trim();

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
  const timeout = setTimeout(() => controller.abort(), 2000);

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
    budget = 'medium',
    duration = '7 days',
    interests = [],
    travelStyle = 'standard',
    transportationType = 'any'
  } = preferences;

  return `Plan a trip from ${startLocation} to ${destination}.

TRIP DETAILS:
- Start location: ${startLocation}
- Destination: ${destination}
- Budget: ${budget}
- Duration: ${duration}
- Interests: ${interests.join(', ') || 'varied attractions'}
- Travel style: ${travelStyle}
- Preferred transportation: ${transportationType}

Return a travel plan in the following format (each section should be formatted using markdown for better readability):

Do not add any additional information or comments. You may add emojis in appropriate places.

1. TRIP SUMMARY: A short overview of the route, main highlights, and general advice.
2. TRANSPORTATION: Best travel options between locations (plane, train, bus, car) with approximate prices and travel time.
3. DAILY PLAN: Detailed day-by-day itinerary including places to visit, attractions, and recommended local experiences.
4. ACCOMMODATION: Recommended places to stay in different price ranges.
5. LOCAL CUISINE: Suggested dishes and restaurants worth visiting.
6. PRACTICAL TIPS: Local culture advice, transportation, safety, and other practical aspects.
7. ESTIMATED BUDGET: Approximate total trip cost broken down by category.
8. TRIP TITLE: A short catchy title for this trip (2-3 words max, no markdown formatting).
9. LONGITUDE: Longitude of the destination.
10. LATITUDE: Latitude of the destination.

Each section should be clearly labeled with its number and title (e.g., "1. TRIP SUMMARY:"), followed by detailed content. Use markdown formatting (## for headings, * for lists, ** for bold).`;
}

function parseTripPlanFromText(text: string): TripPlan {
  const sectionTitles = [
    'TRIP SUMMARY',
    'TRANSPORTATION',
    'DAILY PLAN',
    'ACCOMMODATION',
    'LOCAL CUISINE',
    'PRACTICAL TIPS',
    'ESTIMATED BUDGET',
    'TRIP TITLE',
    'LONGITUDE',
    'LATITUDE'
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
        currentHeader.title.toUpperCase().includes(title)
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
    summary: sectionMap['TRIP SUMMARY'],
    transportation: sectionMap['TRANSPORTATION'],
    dailyPlans: sectionMap['DAILY PLAN'],
    accommodation: sectionMap['ACCOMMODATION'],
    localCuisine: sectionMap['LOCAL CUISINE'],
    practicalTips: sectionMap['PRACTICAL TIPS'],
    estimatedBudget: sectionMap['ESTIMATED BUDGET'],
    title: sectionMap['TRIP TITLE'],
    longitude: parseFloat(sectionMap['LONGITUDE'].replace(/[^\d.-]/g, '')) || 0,
    latitude: parseFloat(sectionMap['LATITUDE'].replace(/[^\d.-]/g, '')) || 0,
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
  title: string;
  longitude: number;
  latitude: number;
  rawContent: string;
}
