# CalorieTracker

A full-stack web application for tracking daily food intake and calorie consumption. Built with React, TypeScript, Express.js, and Tailwind CSS.

## Features

- **Daily Food Logging**: Add foods with calories, serving sizes, and meal types
- **Progress Tracking**: Visual progress bars showing daily calorie consumption vs goals
- **Weekly Analytics**: Charts and statistics for weekly eating patterns
- **Goal Management**: Set and update daily calorie targets
- **Recent Foods**: Quick-add functionality for frequently consumed foods
- **Meal Organization**: Categorize entries by breakfast, lunch, dinner, and snacks
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Tailwind CSS** for styling
- **shadcn/ui** components built on Radix UI
- **Vite** for development and build tooling

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **Zod** for data validation
- **In-memory storage** (ready for PostgreSQL integration)

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jbrandinger/calorie-tracker.git
cd calorie-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── dashboard/  # Dashboard-specific components
│   │   │   ├── layout/     # Layout components (sidebar, header)
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Zod schemas and TypeScript types
└── package.json           # Project dependencies and scripts
```

## API Endpoints

### Food Entries
- `GET /api/food-entries/:date` - Get food entries for a specific date
- `GET /api/food-entries?startDate=X&endDate=Y` - Get entries for date range
- `POST /api/food-entries` - Create a new food entry
- `PATCH /api/food-entries/:id` - Update a food entry
- `DELETE /api/food-entries/:id` - Delete a food entry

### Recent Foods
- `GET /api/recent-foods` - Get recently added foods

### Calorie Goals
- `GET /api/calorie-goals/:date` - Get calorie goal for a specific date
- `POST /api/calorie-goals` - Set/update calorie goal

## Usage

### Adding Foods
1. Navigate to the "Add Food" page or use the quick-add form on the dashboard
2. Enter the food name, calories, serving size, and meal type
3. Click "Add to Log" to save the entry

### Viewing Progress
- The dashboard shows daily calorie progress with visual indicators
- View weekly trends in the Analytics section
- Check individual meal breakdowns in the Food Log

### Setting Goals
1. Go to the Settings page
2. Update your daily calorie goal
3. The dashboard will reflect your new target immediately

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Adding New Features
1. Define data schemas in `shared/schema.ts`
2. Update storage interface in `server/storage.ts`
3. Add API routes in `server/routes.ts`
4. Create frontend components in `client/src/components/`
5. Add pages to `client/src/pages/` and register in `App.tsx`

## Database Integration

The application currently uses in-memory storage but is designed to easily integrate with PostgreSQL:

1. Set up a PostgreSQL database
2. Configure the `DATABASE_URL` environment variable
3. The Drizzle ORM configuration is already in place
4. Run database migrations with `npx drizzle-kit push`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Screenshots

### Dashboard
The main dashboard provides an overview of daily calorie intake, progress towards goals, and quick access to add new foods.

### Food Log
Detailed view of all food entries organized by meal type with options to edit or delete entries.

### Analytics
Weekly progress charts and statistics to help track eating patterns over time.

### Settings
Configure daily calorie goals and other application preferences.