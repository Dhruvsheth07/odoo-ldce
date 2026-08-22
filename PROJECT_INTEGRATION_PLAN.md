# GlobeTrotter — Project Integration Plan
*Integrating Stitch UI designs into the existing application*

---

## 1. Existing Architecture

### Backend (`d:\odoo2\backend`)
| Component        | Technology                              |
|------------------|-----------------------------------------|
| Runtime          | Node.js + Express (ESM)                 |
| ORM              | Prisma with PostgreSQL                  |
| Auth             | JWT (bcrypt + jsonwebtoken)             |
| Validation       | Zod                                     |
| External APIs    | Google Places, Amadeus + fallback engine|
| Entry point      | `src/server.js` → `src/app.js`          |

### Frontend (`d:\odoo2\frontend`)
| Component        | Technology                    |
|------------------|-------------------------------|
| Framework        | React 19 + Vite 8             |
| Styling          | Tailwind CSS v4 (`@tailwindcss/vite`) |
| State Management | Zustand (3 stores)            |
| Routing          | react-router-dom v7           |
| HTTP Client      | Axios                         |
| Charts           | Recharts                      |
| Calendar         | FullCalendar React            |
| Icons            | lucide-react                  |
| Notifications    | react-hot-toast               |

### Frontend Files Already Created
| Path                        | Status           |
|-----------------------------|------------------|
| `src/stores/useAuthStore.js`| ✅ Complete       |
| `src/stores/useTripStore.js`| ✅ Complete       |
| `src/stores/useUIStore.js`  | ✅ Complete       |
| `src/services/api.js`       | ✅ Complete       |
| `src/services/tripApi.js`   | ✅ Complete       |
| `src/services/discoveryApi.js`| ✅ Complete     |
| `src/services/expenseApi.js`| ✅ Complete (+ budget, calendar, share, saved, user APIs) |
| `src/utils/formatters.js`   | ✅ Complete       |
| `src/utils/dateUtils.js`    | ✅ Complete       |
| `src/utils/constants.js`    | ✅ Complete       |
| `src/components/common/Navbar.jsx` | ⚠️ Needs redesign to match Stitch |
| `src/components/common/PriceBadge.jsx` | ✅ Reusable |
| `src/components/common/Loader.jsx` | ⚠️ Needs redesign |
| `src/components/common/EmptyState.jsx` | ⚠️ Needs redesign |
| `src/components/common/Modal.jsx` | ⚠️ Needs redesign |
| `src/layouts/AppLayout.jsx` | ⚠️ Needs redesign |
| `src/layouts/PublicLayout.jsx` | ⚠️ Needs redesign |
| `src/pages/Landing.jsx`     | ⚠️ Needs redesign |
| `src/index.css`             | ⚠️ Must replace with Stitch design system |

---

## 2. Stitch Screens Available (28 total)

| #  | Stitch Screen Title                                   | Screen ID  | Device  |
|----|-------------------------------------------------------|------------|---------|
| 1  | Login - GlobeTrotter                                  | `27e086ea` | Desktop |
| 2  | Login - GlobeTrotter (Mobile)                         | `e84a49b0` | Mobile  |
| 3  | Sign Up - GlobeTrotter                                | `32abe2d2` | Desktop |
| 4  | Sign Up - GlobeTrotter (Mobile Error)                 | `c547bb8e` | Mobile  |
| 5  | Sign Up Success - GlobeTrotter                        | `ba047765` | Desktop |
| 6  | Dashboard - GlobeTrotter                              | `59731a67` | Desktop |
| 7  | Dashboard (Empty State) - GlobeTrotter                | `5cdd5e70` | Desktop |
| 8  | My Trips - GlobeTrotter                               | `ce09bdcf` | Desktop |
| 9  | My Trips (Empty State) - GlobeTrotter                 | `83fd3229` | Desktop |
| 10 | My Trips (Loading & Error States) - GlobeTrotter      | `dc0c567a` | Desktop |
| 11 | Create New Trip - GlobeTrotter                        | `bfd725a9` | Desktop |
| 12 | Create New Trip (Errors) - GlobeTrotter               | `f2912ad0` | Desktop |
| 13 | Create New Trip (Loading & Upload) - GlobeTrotter     | `3ed5dd8b` | Desktop |
| 14 | Trip Overview - Summer in Amalfi                      | `e00b8222` | Desktop |
| 15 | City Stop Explorer - Paris                            | `c5e6a6b5` | Desktop |
| 16 | Hotels in Paris - GlobeTrotter                        | `0c8420ee` | Desktop |
| 17 | Hotel Detail - Hôtel Plaza Athénée                    | `ccdad316` | Desktop |
| 18 | Transport Search - GlobeTrotter                       | `868e216a` | Desktop |
| 19 | Itinerary Builder - GlobeTrotter                      | `9cfbd449` | Desktop |
| 20 | Itinerary View - Summer in Amalfi                     | `8a8ea109` | Desktop |
| 21 | Trip Expenses - Summer in Amalfi                      | `59d15b5e` | Desktop |
| 22 | Trip Expenses (Empty & Loading) - GlobeTrotter        | `91c86d92` | Desktop |
| 23 | Add Expense - GlobeTrotter                            | `3f5058a1` | Desktop |
| 24 | Trip Budget - Summer in Amalfi                        | `1e539b6e` | Desktop |
| 25 | Trip Calendar - Summer in Amalfi                      | `20d0b800` | Desktop |
| 26 | Share Trip Settings - Summer in Amalfi                | `e5fe2e82` | Desktop |
| 27 | Public Trip Itinerary - Summer in Amalfi              | `05d46de5` | Desktop |
| 28 | Profile & Settings - GlobeTrotter                     | `20457e7b` | Desktop |

---

## 3. Existing React Routes (Planned)

| Route                          | Status             |
|--------------------------------|--------------------|
| `/`                            | Landing.jsx exists |
| `/login`                       | Not created        |
| `/signup`                      | Not created        |
| `/dashboard`                   | Not created        |
| `/trips`                       | Not created        |
| `/trips/create`                | Not created        |
| `/trips/:tripId`               | Not created        |
| `/trips/:tripId/explore`       | Not created        |
| `/trips/:tripId/hotels`        | Not created        |
| `/trips/:tripId/transport`     | Not created        |
| `/trips/:tripId/itinerary`     | Not created        |
| `/trips/:tripId/expenses`      | Not created        |
| `/trips/:tripId/budget`        | Not created        |
| `/trips/:tripId/calendar`      | Not created        |
| `/trips/:tripId/share`         | Not created        |
| `/profile`                     | Not created        |
| `/public/trips/:shareToken`    | Not created        |

---

## 4. Existing API Routes (Backend — ALL complete)

| Method | Endpoint                               | Controller            |
|--------|----------------------------------------|-----------------------|
| POST   | `/api/auth/register`                   | authController        |
| POST   | `/api/auth/login`                      | authController        |
| POST   | `/api/auth/logout`                     | authController        |
| GET    | `/api/auth/me`                         | authController        |
| GET    | `/api/users/me`                        | userController        |
| PUT    | `/api/users/me`                        | userController        |
| DELETE | `/api/users/me`                        | userController        |
| GET    | `/api/trips`                           | tripController        |
| POST   | `/api/trips`                           | tripController        |
| GET    | `/api/trips/recent`                    | tripController        |
| GET    | `/api/trips/upcoming`                  | tripController        |
| GET    | `/api/trips/:id`                       | tripController        |
| PUT    | `/api/trips/:id`                       | tripController        |
| DELETE | `/api/trips/:id`                       | tripController        |
| GET    | `/api/trips/:tripId/stops`             | stopController        |
| POST   | `/api/trips/:tripId/stops`             | stopController        |
| PUT    | `/api/trips/:tripId/stops/reorder`     | stopController        |
| PUT    | `/api/trips/stops/:stopId`             | stopController        |
| DELETE | `/api/trips/stops/:stopId`             | stopController        |
| GET    | `/api/places/search`                   | placeController       |
| GET    | `/api/places/nearby`                   | placeController       |
| GET    | `/api/places/:placeId`                 | placeController       |
| GET    | `/api/activities/search`               | activityController    |
| POST   | `/api/activities/stops/:stopId`        | activityController    |
| PUT    | `/api/activities/:activityId/schedule` | activityController    |
| DELETE | `/api/activities/:activityId`          | activityController    |
| GET    | `/api/hotels/search`                   | hotelController       |
| POST   | `/api/hotels/stops/:stopId`            | hotelController       |
| DELETE | `/api/hotels/:accommodationId`         | hotelController       |
| GET    | `/api/transport/search`                | transportController   |
| POST   | `/api/transport/trips/:tripId`         | transportController   |
| DELETE | `/api/transport/:transportId`          | transportController   |
| GET    | `/api/flights/search`                  | flightController      |
| GET    | `/api/expenses/trips/:tripId`          | expenseController     |
| POST   | `/api/expenses/trips/:tripId`          | expenseController     |
| PUT    | `/api/expenses/:id`                    | expenseController     |
| DELETE | `/api/expenses/:id`                    | expenseController     |
| GET    | `/api/budget/trips/:tripId`            | budgetController      |
| GET    | `/api/calendar/trips/:tripId`          | calendarController    |
| PUT    | `/api/share/trips/:tripId`             | shareController       |
| GET    | `/api/share/:shareToken`               | shareController       |
| POST   | `/api/share/:shareToken/copy`          | shareController       |
| GET    | `/api/saved-destinations`              | savedDestController   |
| POST   | `/api/saved-destinations`              | savedDestController   |
| DELETE | `/api/saved-destinations/:id`          | savedDestController   |
| GET    | `/api/health`                          | (inline)              |

---

## 5. Stitch Screen → React Route → API Endpoint Mapping

| Stitch Screen                  | React Route                  | API Service          | Backend Endpoint(s)            |
|--------------------------------|------------------------------|----------------------|-------------------------------|
| Login                          | `/login`                     | useAuthStore.login   | `POST /api/auth/login`        |
| Sign Up                        | `/signup`                    | useAuthStore.register| `POST /api/auth/register`     |
| Dashboard                      | `/dashboard`                 | tripApi              | `GET /api/trips/recent`, `/upcoming` |
| My Trips                       | `/trips`                     | tripApi.getAll       | `GET /api/trips`              |
| Create New Trip                 | `/trips/create`              | tripApi.create       | `POST /api/trips`             |
| Trip Overview                   | `/trips/:tripId`             | tripApi.getOne       | `GET /api/trips/:id`          |
| City Stop Explorer              | `/trips/:tripId/explore`     | discoveryApi         | places, activities search     |
| Hotels in Paris                 | `/trips/:tripId/hotels`      | discoveryApi         | `GET /api/hotels/search`      |
| Transport Search                | `/trips/:tripId/transport`   | discoveryApi         | transport/flights search      |
| Itinerary Builder/View          | `/trips/:tripId/itinerary`   | tripApi, discoveryApi| stops, activities             |
| Trip Expenses                   | `/trips/:tripId/expenses`    | expenseApi           | `GET/POST /api/expenses/...`  |
| Add Expense (modal)             | (modal on expenses page)     | expenseApi.create    | `POST /api/expenses/trips/...`|
| Trip Budget                     | `/trips/:tripId/budget`      | budgetApi            | `GET /api/budget/trips/...`   |
| Trip Calendar                   | `/trips/:tripId/calendar`    | calendarApi          | `GET /api/calendar/trips/...` |
| Share Trip Settings             | `/trips/:tripId/share`       | shareApi             | `PUT /api/share/trips/...`    |
| Public Trip Itinerary           | `/public/trips/:shareToken`  | shareApi.getShared   | `GET /api/share/:shareToken`  |
| Profile & Settings             | `/profile`                   | userApi              | `GET/PUT/DELETE /api/users/me`|

---

## 6. Components That Can Be Reused (from existing)

| Component          | Path                                    | Reuse Status          |
|--------------------|-----------------------------------------|-----------------------|
| PriceBadge         | `src/components/common/PriceBadge.jsx`  | ✅ Logic reusable, restyle |
| API client         | `src/services/api.js`                   | ✅ Keep as-is              |
| All API services   | `src/services/*.js`                     | ✅ Keep as-is              |
| Auth store         | `src/stores/useAuthStore.js`            | ✅ Keep as-is              |
| Trip store         | `src/stores/useTripStore.js`            | ✅ Keep as-is              |
| UI store           | `src/stores/useUIStore.js`              | ✅ Keep as-is              |
| Formatters         | `src/utils/formatters.js`               | ✅ Keep as-is              |
| Date utils         | `src/utils/dateUtils.js`                | ✅ Keep as-is              |
| Constants          | `src/utils/constants.js`                | ✅ Keep as-is              |

---

## 7. Components That Need to Be Created / Redesigned

### Must Redesign (exist but need Stitch styling)
- `Navbar.jsx` — Stitch uses light nav with "GlobeTrotter" headline-md branding
- `Modal.jsx` — Stitch uses warm-white modals with soft shadow
- `EmptyState.jsx` — Stitch uses specific empty state illustrations
- `Loader.jsx` — Stitch uses skeleton loaders on neutral backgrounds
- `AppLayout.jsx` — Layout wrapper needs light-mode base
- `PublicLayout.jsx` — Same
- `Landing.jsx` — Remove, not in Stitch (or redesign as redirect)

### Must Create (new components per Stitch)
- **Auth:** `Login.jsx`, `Signup.jsx`
- **Dashboard:** `Dashboard.jsx`, `DashboardEmpty.jsx`
- **Trips:** `MyTrips.jsx`, `TripCard.jsx`, `CreateTrip.jsx`
- **Trip Detail:** `TripDetail.jsx`, `TripOverview.jsx`, `TripNav.jsx`
- **Explore:** `CityExplorer.jsx`, `PlaceCard.jsx`, `ActivityCard.jsx`
- **Hotels:** `HotelSearch.jsx`, `HotelCard.jsx`, `HotelDetail.jsx`
- **Transport:** `TransportSearch.jsx`, `TransportCard.jsx`
- **Itinerary:** `ItineraryBuilder.jsx`, `ItineraryView.jsx`, `ItineraryDay.jsx`, `ItineraryItem.jsx`
- **Expenses:** `ExpenseList.jsx`, `ExpenseCard.jsx`, `AddExpenseModal.jsx`
- **Budget:** `BudgetOverview.jsx`, `CategoryChart.jsx`, `DailySpendChart.jsx`
- **Calendar:** `CalendarView.jsx`
- **Share:** `ShareSettings.jsx`, `PublicTrip.jsx`
- **Profile:** `Profile.jsx`
- **Common:** `SearchBar.jsx`, `FilterBar.jsx`, `RatingBadge.jsx`, `ConfirmDialog.jsx`, `LoadingSkeleton.jsx`, `ErrorState.jsx`

---

## 8. Potential Conflicts

| Conflict                              | Resolution                                      |
|---------------------------------------|--------------------------------------------------|
| Dark mode CSS vs Stitch light mode    | Replace `index.css` entirely with Stitch tokens  |
| Existing `Landing.jsx` hero page      | Keep as marketing page, redirect authenticated users to dashboard |
| Tailwind v4 `@theme` approach         | Rewrite `@theme` block to match Stitch palette   |
| Font change (Outfit → Montserrat)     | Update Google Fonts import                       |
| Glassmorphism classes (.glass, etc)   | Remove, replace with Stitch Surface/Card classes |
| FullCalendar dark mode overrides      | Rewrite for light-mode Stitch palette            |

---

## 9. Integration Plan (Execution Order)

### Phase 1: Design Foundation
1. Replace `index.css` with Stitch design tokens (colors, typography, spacing, shapes)
2. Redesign `Navbar.jsx` to match Stitch navigation
3. Redesign `Modal.jsx`, `EmptyState.jsx`, `Loader.jsx` to match Stitch
4. Update `AppLayout.jsx` and `PublicLayout.jsx`
5. Create `App.jsx` with router and all routes
6. Create `main.jsx` entry point

### Phase 2: Authentication
7. Create `Login.jsx` (from Stitch screen #1)
8. Create `Signup.jsx` (from Stitch screen #3)

### Phase 3: Dashboard & Trips
9. Create `Dashboard.jsx` (from Stitch screens #6, #7)
10. Create `MyTrips.jsx` (from Stitch screens #8, #9, #10)
11. Create `TripCard.jsx` component
12. Create `CreateTrip.jsx` (from Stitch screens #11, #12, #13)

### Phase 4: Trip Workspace
13. Create `TripDetail.jsx` with tab navigation
14. Create `TripOverview.jsx` (from Stitch screen #14)
15. Create `CityExplorer.jsx` (from Stitch screen #15)
16. Create `HotelSearch.jsx` + `HotelCard.jsx` (from Stitch screens #16, #17)
17. Create `TransportSearch.jsx` (from Stitch screen #18)

### Phase 5: Itinerary & Planning
18. Create `ItineraryBuilder.jsx` (from Stitch screen #19)
19. Create `ItineraryView.jsx` (from Stitch screen #20)

### Phase 6: Financial
20. Create `ExpenseList.jsx` + `AddExpenseModal.jsx` (from Stitch screens #21, #22, #23)
21. Create `BudgetOverview.jsx` (from Stitch screen #24)

### Phase 7: Calendar, Sharing, Profile
22. Create `CalendarView.jsx` (from Stitch screen #25)
23. Create `ShareSettings.jsx` (from Stitch screen #26)
24. Create `PublicTrip.jsx` (from Stitch screen #27)
25. Create `Profile.jsx` (from Stitch screen #28)

### Phase 8: Polish
26. Visual comparison against Stitch screenshots
27. Responsive testing
28. Loading/empty/error state implementation
29. End-to-end flow testing

---

## 10. Missing Backend Endpoints

No missing endpoints identified. All Stitch screens map to existing API routes.

The backend has **complete coverage** for:
- Auth (login, register, logout, me)
- User profile (get, update, delete)
- Trips CRUD + recent/upcoming
- Stops CRUD + reorder
- Places search + nearby + details
- Activities search + CRUD + schedule
- Hotels search + CRUD
- Transport search + CRUD
- Flights search
- Expenses CRUD
- Budget analytics
- Calendar events
- Share toggle + view + copy
- Saved destinations CRUD

---

## 11. Backend Modifications Required

**None.** The existing backend fully supports all Stitch screens.

No backend code needs to be changed.
