# React Calendar Application

A modern, feature-rich calendar application built with React that allows users to manage events, appointments, and schedules with an intuitive interface.

## Features

- 📅 Interactive calendar interface with month navigation
- ✨ Event management (create, edit, delete)
- 🔍 Event search and filtering
- 📱 Responsive design for mobile and desktop
- 💾 Local storage persistence
- 📤 Export functionality for events
- 🎨 Category-based event organization
- ⏰ Event reminders
- 📋 Detailed event information management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ashank22/Calendar.git
cd calendar-task
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Dependencies

- React
- SCSS for styling
- @/components/ui/Button (Make sure this component is available in your project)

## Usage

### Basic Navigation

- Use the arrow buttons (`<` and `>`) to navigate between months
- Click "Today" to return to the current month
- View the current month and year in the header

### Managing Events

#### Creating Events
1. Click on any date in the calendar
2. Fill in the event details in the modal:
   - Event Name (required)
   - Start Time (required)
   - End Time (required)
   - Location (optional)
   - Category (Meeting/Personal/Birthday)
   - Reminder settings
   - Description (optional)

#### Editing Events
1. Click on an existing event
2. Modify the details in the modal
3. Click "Update" to save changes

#### Deleting Events
1. Open an existing event
2. Click the "Delete" button
3. Confirm deletion

### Event Sidebar

- Click "View Events" to open the sidebar
- Use the search bar to find specific events
- Filter events by category
- Click on any event in the sidebar to view/edit details

### Exporting Events

- Click the "export" button to download events for the current month
- Events are exported in JSON format

## Local Storage

The application automatically saves:
- Current calendar date
- All events and appointments

Data persists across browser sessions.

## Customization

### Categories
Default event categories:
- Meeting
- Personal
- Birthday

### Reminder Options
- 5 minutes before
- 15 minutes before
- 30 minutes before
- 1 hour before

## Component Structure

```
Calendar/
├── Calendar.jsx       # Main component
├── Calendar.scss     # Main styles
├── Popup.scss        # Modal styles
└── Sidebar.scss      # Sidebar styles
```

## Mobile Responsiveness

The application includes responsive design with:
- Adapted layout for different screen sizes
- Mobile-friendly event management
- Collapsible sidebar for smaller screens


## Author

ASHANK KUMAR KUSHWAHA
IIT KHARAGPUR
