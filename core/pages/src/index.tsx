import type { RouteObject } from 'react-router-dom'
import { LandingScreen } from './landing.tsx'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: LandingScreen.render,
    loader: LandingScreen.load,
    handle: LandingScreen.head(),
  },
]
