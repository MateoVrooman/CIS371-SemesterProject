# Key Features

## Athlete's Features

- Join a team
- Log workout results
- View workout history
- Access training plans
- View lineups

## Coaches' Features

- Create/Join a team
- Create and manage training plans
- View workout results for all athletes on the team
- Create daily lineups
- Send messages to the team

---

# Architecture

## Frontend

Uses ReactJS and Next.js - Tailwind for styling

### Pages

- /login: Log in to existing account.
- /register: Create an account.
- /dashboard: Landing page, gives a summary of recent workouts and races, upcoming practices, and messages.
- /workouts: Athletes log workouts with the workoutForm which sends data to firestore.
- /training-plans: Coaches can manage training plans here and assign workouts. Athletes can view the training plan created by the coach.
- /lineups: Coaches create lineups via the lineupCard. Athletes can view their crew assignments for a practice.
- /messages: Athletes and coaches can view and send messages.
- /calendar: Athletes and coaches can see a calendar view of workouts, lineups, and events.

### Components

- Navbar: Display navigation links to dash, workouts, training plans, etc.
- LoginForm: Allow the user to create an account or login
- WorkoutForm: Form for athletes to log workout data
- WorkoutCard: A display card showing workout summary
- TrainingPlanCard: A card displaying details of a training plan
- LineupCard: A card displaying the lineup for a specific boat and date
- CalendarView: Display workouts and lineups in a calendar format
- TeamMemberCard: Display information about team members
- TeamInviteForm: Form for inviting athletes or coaches to join a team
- MessageForm: A form for sending a new message to a team or individual athlete or coach
- ProfilePage: Display a user's profile with stats, history, and team association

## Backend

Next.js handles API routes and backend calls

- CRUD operations on Firestore
- User authentication
- Possible integration with Garmin or AppleWatch APIs

---
