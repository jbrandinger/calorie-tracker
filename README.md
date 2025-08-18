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

## Database Integration

The application currently uses in-memory storage but is designed to easily integrate with PostgreSQL:

1. Set up a PostgreSQL database
2. Configure the `DATABASE_URL` environment variable
3. The Drizzle ORM configuration is already in place
4. Run database migrations with `npx drizzle-kit push`