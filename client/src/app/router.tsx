import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout, AppLayout, AuthLayout } from '@/layouts'
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth'
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
  TeamPerformancePage,
  MemberPerformancePage,
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
      // Guest-only auth routes (redirect to /app/dashboard if already logged in)
      {
        element: <PublicOnlyRoute />,
        children: [
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
        ],
      },
      // Protected workspace routes (require authenticated session)
      {
        path: 'app',
        element: <ProtectedRoute />,
        children: [
          {
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
                path: 'projects/:projectId/accountability',
                element: <ProjectDetailPage defaultTab="accountability" />,
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
                path: 'team/performance',
                element: <TeamPerformancePage />,
              },
              {
                path: 'team/performance/:memberId',
                element: <MemberPerformancePage />,
              },
              {
                path: 'settings',
                element: <SettingsPage />,
              },
            ],
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
