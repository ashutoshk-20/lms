``````md path="README.md"
# LMS (Learning Management System)

## Overview
A full‑stack Learning Management System that allows **students** to browse, enroll, and track progress in courses, while **admins** can manage courses, lectures, and users.  
The project is split into a **React** front‑end (Vite) and a **Node.js/Express** back‑end with **MongoDB** for persistence.

## Key Features
- **User Authentication** – JWT based login & registration (bcrypt password hashing).  
- **Role‑based Access** – Admin routes are protected with `ProtectedRoutes` component and server‑side middleware.  
- **Course Management** – CRUD for courses & lectures (admin panel).  
- **Progress Tracking** – Students can view completed lectures and overall course progress.  
- **Rich Text Editor** – Lecture content editing with a customizable editor.  
- **File Uploads** – Media uploads (images, videos) stored via **Cloudinary** and local `uploads/` directory using **multer**.  
- **Dark/Light Theme** – Global theming with a `ThemeProvider`.  
- **Responsive UI** – Built with reusable UI components (buttons, cards, dialogs, etc.).  
- **Doubts Handling** - Created a automated workflow in n8n to resolve students doubts related to the course

## Tech Stack
| Layer | Technology |
|-------|------------|
| Front‑end | React 18, Vite, Redux Toolkit (`store.js`), React Router, Tailwind CSS (via UI components) |
| Back‑end | Node.js, Express, Mongoose, MongoDB, JWT, Bcrypt.js |
| Media | Cloudinary SDK, Multer |
| Utilities | dotenv, cors, jsonwebtoken, axios (for API calls) |
| Testing / Linting | (not included yet) |

## Getting Started

### Prerequisites
- **Node.js** (v14+ recommended)  
- **npm** or **yarn**  
- **MongoDB** instance (local or Atlas)  
- **Cloudinary** account (optional, for media storage)  

### Installation

```bash
# Clone the repo
git clone https://github.com/ashutoshk-20/lms.git
cd lms

# Install dependencies for both client and server
npm install                 # installs root scripts (if any)
cd client && npm install
cd ../server && npm install
```

### Environment Variables
Create a `.env` file in the **server** directory with the following keys (example values shown):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> The repository already contains a `.gitignore` that excludes `.env`.

### Running the Application

#### Development mode
```bash
# In one terminal – start the server
cd server
npm run dev   # usually runs nodemon or node index.js

# In another terminal – start the client
cd client
npm run dev   # Vite dev server (http://localhost:3000)
```

#### Production build
```bash
# Build the client
cd client
npm run build   # outputs to client/dist

# Serve the built client with the Express server
cd ../server
npm start       # static files served from client/dist
```

## API Overview
All API endpoints are prefixed with `/api`.

| Route | Method | Description | Access |
|-------|--------|-------------|--------|
| `/api/users/register` | POST | Register a new user | Public |
| `/api/users/login` | POST | Authenticate and receive JWT | Public |
| `/api/users/me` | GET | Get logged‑in user profile | Authenticated |
| `/api/courses` | GET | List all courses | Authenticated |
| `/api/courses/:id` | GET | Get a single course with lectures | Authenticated |
| `/api/courses` | POST | Create a new course | Admin |
| `/api/courses/:id` | PUT | Update a course | Admin |
| `/api/courses/:id` | DELETE | Delete a course | Admin |
| `/api/lectures` | POST | Add a lecture to a course | Admin |
| `/api/lectures/:id` | PUT | Edit a lecture | Admin |
| `/api/lectures/:id` | DELETE | Remove a lecture | Admin |
| `/api/courseProgress` | POST | Record lecture completion | Student |
| `/api/courseProgress/:courseId` | GET | Get progress for a course | Student |

> Detailed request/response schemas are defined in `server/controllers/*.js`.

## Folder Structure

```
├── client
│   ├── src
│   │   ├── components      # UI primitives and layout components
│   │   ├── features
│   │   │   ├── api         # axios wrappers (authApi, courseApi, …)
│   │   │   └── authSlice.js
│   │   ├── pages           # React pages (Login, Dashboard, Course, …)
│   │   ├── layout          # MainLayout.jsx
│   │   └── lib/utils.js
│   └── vite.config.js
├── server
│   ├── controllers         # Express route handlers
│   ├── models              # Mongoose schemas
│   ├── middleware
│   │   └── isAuthenticated.js
│   ├── routes              # Route definitions
│   ├── utils
│   │   ├── cloudinary.js   # Cloudinary configuration
│   │   ├── generateToken.js
│   │   └── multer.js       # Multer upload middleware
│   └── index.js            # Express app entry point
├── uploads                 # Temporary upload folder (used by multer)
└── .env (ignored)          # Secrets & config
```

## Contributing
1. Fork the repository.  
2. Create a feature branch (`git checkout -b feature/your-feature`).  
3. Ensure code follows existing linting/formatting conventions.  
4. Submit a Pull Request with a clear description of changes.

## License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---  

Feel free to open issues for bugs or feature requests! Happy coding!