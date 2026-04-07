# 🍃 AirSense

AirSense is a modern, real-time Air Quality Index (AQI) and Weather tracking dashboard built with React, Vite, and TypeScript. It uses geospatial capabilities to monitor nearby station's air qualities, visualize historical trends, and provide weather forecasts at your fingertips.

![AirSense Preview](./public/airsense.png) <!-- if you have an image, we assume it's here given the 28MB airsense.png file in the public folder -->

## ✨ Features

- **Real-Time Data**: Get instantaneous Air Quality Index readings and weather data based on your geolocation.
- **Robust AQI Backup Engine**: Seamlessly falls back to OpenWeatherMap pollution estimates if primary WAQI station data is unavailable or fails. 
- **Interactive Maps**: Explore AQI stations globally using Leaflet mapping integration.
- **Beautiful Visualizations**: Experience smooth, responsive chart rendering for forecasting using Recharts and Framer Motion.
- **Search Capabilities**: Find air quality data for any city worldwide using geocoding.
- **Premium UI/UX**: Designed using Tailwind CSS and Radix UI components for an accessible, beautiful default theme.

## 🛠 Tech Stack

- **Frontend Framework**: React 18 & Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Radix UI (Shadcn UI)
- **Data Fetching & State**: `@tanstack/react-query` & Zustand
- **Mapping & Charts**: React-Leaflet (`leaflet`) & Recharts 
- **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- `npm` or `bun` installed on your machine

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/AirSense.git
cd AirSense
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add your API keys. Make sure your `.env` is ignored securely by git (which is configured by default).

```env
VITE_WAQI_TOKEN=your_waqi_api_token
VITE_OWM_KEY=your_open_weather_map_key
```

> **Note**: You can get your free API keys from [WAQI (World Air Quality Index)](https://aqicn.org/data-platform/token/#/) and [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).

### 4. Run the Development Server

```bash
npm run dev
# or
bun run dev
```

Visit `http://localhost:5173` to view the app!

## 📦 Deployment (Netlify)

This app is optimized as a Single Page Application and includes a `public/_redirects` file to handle React Router client-side path fallbacks.

To deploy on Netlify:
1. Connect your GitHub repository to Netlify.
2. In your Site Settings on Netlify, navigate to **Environment Variables** and securely add `VITE_WAQI_TOKEN` and `VITE_OWM_KEY`.
3. Set the Build Command to `npm run build` and Publish Directory to `dist`.
4. Deploy!

## 📄 License

This project is open-source and ready for anyone to explore or extend.
