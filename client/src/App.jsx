
import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import HeroSection from './pages/student/HeroSection'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import MainLayout from './layout/MainLayout'
import { RouterProvider } from 'react-router'
import Courses from './pages/student/Courses'
import MyLearning from './pages/student/MyLearning'
import Profile from './pages/student/Profile'
import Sidebar from './pages/admin/Sidebar'
import Dashboard from './pages/admin/Dashboard'
import CourseTable from './pages/admin/course/CourseTable'
import AddCourse from './pages/admin/course/AddCourse'
import EditCourse from './pages/admin/course/EditCourse'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseInfo from './pages/student/CourseInfo'
import CourseProgress from './pages/student/CourseProgress'
import SearchPage from './pages/student/SearchPage'
import { AdminRoute, AuthenticatedUser, ProtectedRoutes } from './components/ProtectedRoutes'
import { ThemeProvider } from './components/ThemeProvider'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        )
      },
      {
        path: "login",
        element: <AuthenticatedUser> <Login /> </AuthenticatedUser>
      },
      {
        path: "my-learning",
        element: (
          <ProtectedRoutes>
            <MyLearning />
          </ProtectedRoutes>
        )
      },
      {
        path: "profile",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        )
      },
      {
        path: "course/search",
        element: (
          <>
            <SearchPage />
          </>
        )
      },
      {
        path: "course-detail/:courseId",
        element: (
          <>
            <CourseInfo />
          </>
        )
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoutes>
            <CourseProgress />
          </ProtectedRoutes>
        )
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Sidebar />
          </AdminRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "course",
            element: (
              <CourseTable />
            )
          },
          {
            path: "course/create",
            element: (
              <AddCourse />
            )
          },
          {
            path: "course/:courseId",
            element: (
              <EditCourse />
            )
          },
          {
            path: "course/:courseId/lecture",
            element: (
              <CreateLecture />
            )
          },

          {
            path: "course/:courseId/lecture/:lectureId",
            element: (
              <EditLecture />
            )
          },

        ]
      }

    ]
  },

])

function App() {

  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  )
}

export default App
