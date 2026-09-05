import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout, AppLayout, AuthLayout } from '@/layouts'
import {
  LandingPage,
  LoginPage,
  SignupPage,
  DashboardPage,
  ProjectsPage,
  ProjectDetailPage,
  NewProjectPage,
  TasksPage,
  TeamPage,
  SettingsPage,
  NotFoundPage,
  DesignSystemPage,
} from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'signup',
            element: <SignupPage />,
          },
        ],
      },
      {
        path: 'app',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/app/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'projects',
            element: <ProjectsPage />,
          },
          {
            path: 'projects/new',
            element: <NewProjectPage />,
          },
          {
            path: 'projects/:projectId',
            element: <ProjectDetailPage />,
          },
          {
            path: 'tasks',
            element: <TasksPage />,
          },
          {
            path: 'team',
            element: <TeamPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
        ],
      },
      {
        path: 'dev/design-system',
        element: <DesignSystemPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
