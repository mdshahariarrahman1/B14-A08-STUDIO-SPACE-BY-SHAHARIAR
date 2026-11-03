# 🎬 StudioSpace
### Find a creative space. Make something worth sharing.

**StudioSpace** is a peer-to-peer creative workspace and production studio rental platform that connects creators with studio hosts. Users can discover, explore, and book creative spaces by the hour, while studio owners can manage their listings and reservations.

🌐 **Live Website:** [Visit StudioSpace](https://b14-a08-studio-space-by-shahariar.vercel.app/)

---

## ✨ Features

- **Explore Creative Studios:** Browse photography studios, film stages, podcast lounges, music suites, workshops, and more.
- **Search & Filter:** Easily discover creative spaces based on categories and preferences.
- **Studio Details:** Explore studio images, descriptions, amenities, hourly rates, and booking information.
- **Authentication:** Register and log in using email and password, with Google sign-in support when configured.
- **Studio Booking:** Request studio reservations and track booking status.
- **Wishlist:** Save favorite studios and manage your personal wishlist.
- **Studio Management:** Create, edit, and manage studio listings.
- **Personal Dashboard:** Manage profile information, studio listings, and reservations.
- **Responsive UI:** Enjoy a smooth experience on desktop, tablet, and mobile devices.
- **Notifications:** Get interactive success and error messages with loading states.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 16, React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Authentication:** Better Auth
- **Database:** MongoDB
- **Backend:** Separate Studio Catalog API
- **UI Components:** Base UI
- **Icons:** Lucide React
- **Carousel:** Embla Carousel
- **Deployment:** Vercel

---

## 🚀 Local Installation & Setup

Follow these steps to run the project locally.

**1. Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

**2. Navigate to the project folder**

```bash
cd your-project-folder
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env.local` file in the root directory:

```env
BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
MONGODB_URL=
BACKEND_URL=
BOOKING_API_SECRET=
```

Configure the required credentials and make sure the studio backend is running with the matching shared secret.

**5. Run the development server**

```bash
npm run dev
```

**6. Open the application**

Visit `http://localhost:3000` in your browser.

---

## 🔐 Examiner Test Credentials

There is no pre-configured shared examiner account.

Please follow these steps to test the application:

1. Visit the [StudioSpace Live Website](https://b14-a08-studio-space-by-shahariar.vercel.app/).
2. Navigate to the **Register** page.
3. Create a new account using your email and password.
4. Log in with your newly created account.
5. Explore the dashboard, studio listings, wishlist, and booking features.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Check TypeScript errors |
| `npm run build` | Build production application |
| `npm run start` | Start production server |

---

## 👨‍💻 About the Developer

**Md Shahariar Rahman Shifat**

**Full-Stack Web Developer**

Passionate about building modern, responsive, and user-friendly web applications with a focus on clean code, performance, and great user experiences.

- **GitHub:** [mdshahariarrahman1](https://github.com/mdshahariarrahman1)
- **Project:** StudioSpace
- **Project Type:** Full-Stack Web Application

---

### ❤️ Developed by Md Shahariar Rahman Shifat

*Turning creative ideas into meaningful digital experiences.*