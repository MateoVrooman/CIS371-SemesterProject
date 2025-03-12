# Database Structure

### `users` collection

- userId (string)
- name (string)
- email (string)
- role (athlete or coach)
- teamId (reference)
- profilePic (string, optional)
- joinedDate (timestamp)
- workoutHistory (array of references)

### `teams` collection

- teamId (string)
- teamName (string)
- coachId (reference)
- athleteIds (array of references)
- createdAt (timestamp)
- teamLogo (string, optional)

### `workouts` collection

- workoutId (string)
- userId (reference)
- date (timestamp)
- type (string)
- metrics (map)
  - distance (float)
  - time (float)
  - averageHeartRate (int, optional)
  - maxHeartRate (int, optional)
  - pace (float)
- comments (array of strings)

### `trainingPlans` collection

- planId (string)
- teamId (reference)
- planName (string)
- startDate (timestamp)
- endDate (timestamp)
- workouts (array of maps)
  - date (timestamp)
  - type (string)
  - assignedAthletes (array of references)
- createdBy (reference)

### `lineups` collection

- lineupId (string)
- teamId (reference)
- date (timestamp)
- athleteIds (array of references)
- practiceDetails (string, maybe reference to workout doc)

---

## Subcollections

Possibly store workout data as a subcollection of users instead of its own collection. Structure could be:
`users/{userId}/workouts/{workoutId}`
This way, when querying for a user's workouts, we only need to pull the relevant documents for that user

Possibly store lineups as a subcollection where the lineup contains a subcollection of athletes
`lineups/{lineupId}/athletes/{athleteId}`
