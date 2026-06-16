import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'

jest.mock('react-router-dom', () => {
  const React = require('react')

  const normalizePath = (value) => (value || '').replace(/\/+$/, '')

  const matchPath = (pattern, pathname) => {
    const normalizedPattern = normalizePath(pattern)
    const normalizedPathname = normalizePath(pathname)
    if (normalizedPattern === normalizedPathname) return true
    const patternSegments = normalizedPattern.split('/').filter(Boolean)
    const pathSegments = normalizedPathname.split('/').filter(Boolean)
    if (patternSegments.length !== pathSegments.length) return false
    return patternSegments.every((segment, index) =>
      segment.startsWith(':') || segment === pathSegments[index]
    )
  }

  const BrowserRouter = ({ children }) => <>{children}</>
  const Route = ({ element }) => element
  const Navigate = ({ to }) => <div data-testid={`navigate-to-${to}`} />

  const Routes = ({ children }) => {
    const routes = React.Children.toArray(children)
    const currentPath = globalThis.location.pathname
    const matchingRoute = routes.find((route) =>
      matchPath(route.props.path, currentPath)
    )
    if (!matchingRoute) return null
    return matchingRoute.props.element
  }

  const useLocation = () => ({ pathname: globalThis.location.pathname })
  const useNavigate = () => jest.fn()
  const useParams = () => ({})
  const Link = ({ children, to }) => <a href={to}>{children}</a>

  return { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams, Link }
})

// Match your actual firebase.js exports
jest.mock('./config/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
  },
  db: {},
  provider: {},
  storage: {},
}))

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  getDoc: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  addDoc: jest.fn(),
  writeBatch: jest.fn(),
  serverTimestamp: jest.fn(),
}))

jest.mock('firebase/storage', () => ({ getStorage: jest.fn() }))

// Match your actual component paths
jest.mock('./components/Header', () => () => <div>Header</div>)
jest.mock('./pages/Home', () => () => <div>Home page</div>)
jest.mock('./pages/Login', () => () => <div>Login page</div>)
jest.mock('./pages/SignUp', () => () => <div>SignUp page</div>)
jest.mock('./pages/Browse', () => () => <div>Browse page</div>)
jest.mock('./pages/FoodDetails', () => () => <div>FoodDetails page</div>)
jest.mock('./pages/NewItem', () => () => <div>NewItem page</div>)
jest.mock('./pages/Profile', () => () => <div>Profile page</div>)
jest.mock('./pages/MyListings', () => () => <div>MyListings page</div>)

const { auth } = require('./config/firebase')
const App = require('./App').default

const mockLoggedInUser = (
  user = { uid: 'test-uid', email: 'test@test.com', displayName: 'Test User' }
) => {
  auth.onAuthStateChanged.mockImplementation((callback) => {
    callback(user)
    return jest.fn()
  })
}

const mockLoggedOutUser = () => {
  auth.onAuthStateChanged.mockImplementation((callback) => {
    callback(null)
    return jest.fn()
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  window.history.pushState({}, 'Test page', '/')
})

describe('App routing and auth state', () => {
  test('renders Home page for unauthenticated user', async () => {
    mockLoggedOutUser()
    render(<App />)
    await waitFor(() => expect(screen.getByText('Home page')).toBeInTheDocument())
  })

  test('renders Home page for authenticated user', async () => {
    mockLoggedInUser()
    render(<App />)
    await waitFor(() => expect(screen.getByText('Home page')).toBeInTheDocument())
  })

  test('renders Browse page at /browse', async () => {
    mockLoggedOutUser()
    window.history.pushState({}, 'Browse', '/browse')
    render(<App />)
    await waitFor(() => expect(screen.getByText('Browse page')).toBeInTheDocument())
  })

  test('renders Login page at /login', async () => {
    mockLoggedOutUser()
    window.history.pushState({}, 'Login', '/login')
    render(<App />)
    await waitFor(() => expect(screen.getByText('Login page')).toBeInTheDocument())
  })

  test('renders SignUp page at /signup', async () => {
    mockLoggedOutUser()
    window.history.pushState({}, 'SignUp', '/signup')
    render(<App />)
    await waitFor(() => expect(screen.getByText('SignUp page')).toBeInTheDocument())
  })

  test('protects /profile and redirects unauthenticated user', async () => {
    mockLoggedOutUser()
    window.history.pushState({}, 'Profile', '/profile')
    render(<App />)
    await waitFor(() =>
      expect(screen.getByTestId('navigate-to-/login')).toBeInTheDocument()
    )
  })

  test('allows authenticated user to access /profile', async () => {
    mockLoggedInUser()
    window.history.pushState({}, 'Profile', '/profile')
    render(<App />)
    await waitFor(() => expect(screen.getByText('Profile page')).toBeInTheDocument())
  })

  test('renders NewItem page at /new-item for authenticated user', async () => {
    mockLoggedInUser()
    window.history.pushState({}, 'NewItem', '/new-item')
    render(<App />)
    await waitFor(() => expect(screen.getByText('NewItem page')).toBeInTheDocument())
  })

  test('shows loading state initially', () => {
    auth.onAuthStateChanged.mockImplementation(() => jest.fn()) // never calls callback
    render(<App />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})