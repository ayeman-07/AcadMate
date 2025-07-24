# AcadMate

AcadMate is a modern, all-in-one platform for educational institutions to manage student information, academic records, and communication between faculty and students. It provides role-based access for administrators, professors, and students, each with a dedicated dashboard and functionalities tailored to their needs.

## Tech Stack

### Frontend

*   **Framework:** [Next.js](https://nextjs.org/) (v15)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [React](https://react.dev/) (v19)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/)
*   **UI Components:** [Lucide React](https://lucide.dev/guide/packages/lucide-react) (for icons), [Sonner](https://sonner.emilkowal.ski/) (for notifications), [React Hot Toast](https://react-hot-toast.com/)
*   **Date Picker:** [React Datepicker](https://reactdatepicker.com/)

### Backend

*   **Framework:** [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
*   **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
*   **API Client:** [Axios](https://axios-http.com/)
*   **Email:** [Nodemailer](https://nodemailer.com/)

### Other Tools

*   **Linting:** [ESLint](https://eslint.org/)
*   **Package Manager:** [npm](https://www.npmjs.com/)

## Features

### Admin

*   **Dashboard:** Overview of the system.
*   **User Management:** Create, view, and manage professor and student accounts.
*   **Academic Management:** Manage departments, semesters, and subjects.
*   **Announcements:** Broadcast important information to all users.

### Professor

*   **Dashboard:** Access to assigned courses and student lists.
*   **Attendance:** Record and manage student attendance.
*   **Marks Entry:** Input and update student marks for various exams.
*   **Results:** View and analyze student performance.

### Student

*   **Dashboard:** Personalized view of courses, attendance, and results.
*   **Profile:** View and manage personal information.
*   **Attendance:** Track attendance records.
*   **Results:** View semester-wise results and download report cards.
*   **Syllabus:** Access and download syllabus for their respective courses.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v20 or later)
*   [npm](https://www.npmjs.com/) (v10 or later)
*   [MongoDB](https://www.mongodb.com/try/download/community) (local installation or a cloud-hosted instance)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/acadmate.git
    cd acadmate
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the following variables:

    ```env
    # MongoDB Connection URI
    MONGO_URI=your_mongodb_connection_string

    # NextAuth.js secret
    NEXTAUTH_SECRET=your_nextauth_secret
    NEXTAUTH_URL=http://localhost:3000

    # Email configuration (for Nodemailer)
    EMAIL_HOST=your_email_host
    EMAIL_PORT=your_email_port
    EMAIL_USER=your_email_user
    EMAIL_PASS=your_email_password
    ```

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
/
├── data/                # For mock data or other data files
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router pages and layouts
│   ├── components/      # Reusable React components
│   ├── constants/       # Application constants
│   ├── lib/             # Library functions and utilities
│   ├── models/          # Mongoose models
│   └── middleware.ts    # Next.js middleware
├── .env.local           # Environment variables (create this file)
├── next.config.ts       # Next.js configuration
├── package.json         # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Deployment

The application is ready to be deployed on [Vercel](https://vercel.com/), the creators of Next.js.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.