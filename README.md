# 🌍 TripGenius

Plan your next adventure with the power of AI. **TripGenius** is a modern travel planning app that helps you design, organize, and manage your trips — from inspiration to itinerary — with just a few clicks.

## ✨ Features

🔐 **Full Authentication with Clerk**  
Secure and seamless authentication powered by [Clerk](https://clerk.dev), including session management and user accounts.

🧠 **AI-Powered Travel Planning**  
Using Google's **Gemini API**, TripGenius generates personalized travel itineraries based on your preferences, turning vague ideas into real, actionable plans.

📝 **Markdown Rendering**  
Trip plans returned from the Gemini API are rendered beautifully with markdown-to-jsx for a clean, readable experience.

💾 **Robust Backend**  
Powered by Node.js with Prisma ORM and PostgreSQL database for reliable data storage and management.

📦 **Modern Tech Stack**
- **Next.js** – React framework for fast, SEO-friendly apps
- **Node.js** – JavaScript runtime for the backend
- **Prisma** – Next-generation ORM for database access
- **PostgreSQL** – Advanced open-source relational database
- **TailwindCSS** – Utility-first styling
- **shadcn/ui** – Beautiful, accessible UI components
- **TypeScript** – For type safety and developer happiness

📊 **Travel Dashboard & History**  
View and manage all your past and upcoming trips in one place. Visualize your travel history on an interactive chart.

🗂️ **Trip Organizer**  
Save your favorite travel plans, keep track of itineraries, and print your schedule when you're ready to hit the road.

🌟 **Travel Inspirations**  
Explore AI-generated travel ideas to discover new places and experiences you might not have considered.

🖨️ **Printable Itineraries**  
Download or print your travel plans in a clean format, ready to take with you.

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/tripgenius.git
cd tripgenius
```

### 2. Install Dependencies
```bash
npm install # or yarn install
```

### 3. Set Environment Variables
Create a `.env.local` file in the root with the following values:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_postgresql_connection_string
```

### 4. Set Up the Database
```bash
npx prisma migrate dev
```

### 5. Run the Development Server
```bash
npm run dev # or yarn dev
```

## 📸 Screenshots
Coming soon...

## 📅 Roadmap
* AI-generated itineraries
* Authentication with Clerk
* Dashboard and travel history
* Social sharing of trips
* Multi-language support
* Mobile app (React Native)

## 🛠 Built With
* Next.js
* Node.js
* Prisma
* PostgreSQL
* Clerk
* Gemini API (Google AI)
* TailwindCSS
* shadcn/ui
* markdown-to-jsx

## 💡 Inspiration
We believe travel planning should be easy, fun, and inspiring. TripGenius was built to bring creativity and intelligence into one place, so you can focus on enjoying the journey.
