import type { RouteObject } from 'react-router'
import { LandingScreen } from './landing.tsx'
import { ServicesEditorPage } from './editor/services.tsx'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: LandingScreen.render,
    loader: LandingScreen.load,
    handle: LandingScreen.head(),
  },
  {
    path: '/editor/services',
    Component: ServicesEditorPage.render,
    loader: ServicesEditorPage.load,
  },
]
