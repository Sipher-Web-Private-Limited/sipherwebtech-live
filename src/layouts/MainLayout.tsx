import { Suspense, useEffect, useLayoutEffect } from "react"

import { Outlet, useLocation } from "react-router-dom"

import CursorFollower from "../components/CursorFollower"

import ErrorBoundary from "../components/ErrorBoundary"

import FloatingActions from "../components/FloatingActions"

import Footer from "../components/Footer"

import Loader from "../components/Loader"

import Navbar from "../components/Navbar"

function scrollToTopInstantly() {
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  window.scrollTo({ top: 0, left: 0, behavior: "auto" })
}

export default function MainLayout() {
  const location = useLocation()

  useLayoutEffect(() => {
    document.documentElement.style.overflowAnchor = "none"
    document.body.style.overflowAnchor = "none"

    return () => {
      document.documentElement.style.overflowAnchor = ""
      document.body.style.overflowAnchor = ""
    }
  }, [])

  useLayoutEffect(() => {
    if (location.hash) return

    scrollToTopInstantly()
  }, [location.pathname])

  useEffect(() => {
    const scrollBeforeRouteNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return
      }

      const anchor = event.target.closest<HTMLAnchorElement>("a[href]")
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return

      const destination = new URL(anchor.href, window.location.href)
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname ||
        destination.hash
      ) {
        return
      }

      scrollToTopInstantly()
    }

    document.addEventListener("click", scrollBeforeRouteNavigation, true)
    return () => document.removeEventListener("click", scrollBeforeRouteNavigation, true)
  }, [])

  useLayoutEffect(() => {
    const resetScroll = () => {
      if (window.location.hash) return
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    }
    const resetAfterRestore = () => window.requestAnimationFrame(resetScroll)

    window.addEventListener("pageshow", resetAfterRestore)
    return () => window.removeEventListener("pageshow", resetAfterRestore)
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <FloatingActions />
      <CursorFollower />
    </>
  )
}
