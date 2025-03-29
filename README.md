# Movie Search and Management Web Application

This web application is a feature-rich platform designed for coding test purposes. It showcases modern web development practices, clean architecture, and an engaging user experience. The project is built to demonstrate proficiency in full-stack development, API integration, and responsive design.

## Features

- **User Authentication**:
  - Secure login and registration with token-based authentication.
  - Persistent user sessions using HTTP-only cookies for enhanced security.

- **Movie Search**:
  - Search for movies or series using the OMDB API with real-time filtering.
  - Filter results by type (movie or series) and year range for precise searches.

- **Movie Details**:
  - View comprehensive details about movies, including ratings, plot, cast, and more.
  - Visualized movie detail pages.

- **Favorites Management**:
  - Add or remove movies from a personal favorites list.
  - Floating favorites list for quick access and management.

- **Interactive UI**:
  - A featured carousel showcasing top movies.
  - Fully responsive design for seamless use across devices.
  - Interactive charts for visualizing movie ratings and trends.

- **Developer-Friendly Codebase**:
  - Clean, modular, and scalable architecture.
  - Well-documented code for easy understanding and extension.

## Technologies Used

- **Frontend**:
  - [React](https://reactjs.org/) with [Next.js](https://nextjs.org/) for server-side rendering and routing.
  - [Tailwind CSS](https://tailwindcss.com/) for modern, utility-first styling.
  - [Framer Motion](https://www.framer.com/motion/) for smooth animations and transitions.
  - [Recharts](https://recharts.org/) for dynamic data visualization.

- **State Management**:
  - [Zustand](https://zustand-demo.pmnd.rs/) for lightweight and efficient global state management.

- **Backend**:
  - Next.js API routes for server-side logic and API handling.
  - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for secure token generation and verification.
  - [Zod](https://zod.dev/) for robust schema validation.

- **External API**:
  - [OMDB API](https://www.omdbapi.com/) for fetching rich movie data.

- **Other Tools**:
  - [React Hook Form](https://react-hook-form.com/) for form handling and validation.
  - [Swiper](https://swiperjs.com/) for the featured carousel.


## How to Run

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables for `OMDB_API_KEY`, `JWT_SECRET`, and `JWT_REFRESH_SECRET`.
4. Run the development server using `npm run dev`.
5. Access the application at `http://localhost:3000`.

