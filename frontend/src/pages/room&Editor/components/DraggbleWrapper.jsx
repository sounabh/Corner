/* eslint-disable react/prop-types */
// DraggableWrapper.js
"use client"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
const Draggable = dynamic(() => import("react-draggable"), { ssr: false })

export function DraggableWrapper({ children, handle, bounds, defaultPosition }) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return <>{children}</>
  }
  
  return (
    <Draggable handle={handle} bounds={bounds} defaultPosition={defaultPosition}>
      {children}
    </Draggable>
  )
}
