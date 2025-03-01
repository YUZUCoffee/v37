"use client"

import { useEffect, useRef } from "react"

interface FlavorWheelProps {
  sweetness: number
  cleanliness: number
  aroma: number
  body: number
  acidityBitterness: number
  className?: string
}

export default function FlavorWheel({
  sweetness,
  cleanliness,
  aroma,
  body,
  acidityBitterness,
  className = "",
}: FlavorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Configuration
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) * 0.8
    const angles = 5 // Number of axes
    const maxValue = 5 // Maximum score

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw background polygons
    for (let level = 1; level <= maxValue; level++) {
      const ratio = level / maxValue
      ctx.beginPath()
      for (let i = 0; i <= angles; i++) {
        const angle = (Math.PI * 2 * i) / angles - Math.PI / 2
        const x = centerX + radius * ratio * Math.cos(angle)
        const y = centerY + radius * ratio * Math.sin(angle)
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 * ratio})`
      ctx.stroke()
    }

    // Draw axes
    ctx.beginPath()
    for (let i = 0; i < angles; i++) {
      const angle = (Math.PI * 2 * i) / angles - Math.PI / 2
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle))
    }
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
    ctx.stroke()

    // Draw labels
    const labels = ["Sweetness", "Cleanliness", "Aroma", "Body", "Acidity/Bitterness"]
    ctx.font = "12px system-ui"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"

    labels.forEach((label, i) => {
      const angle = (Math.PI * 2 * i) / angles - Math.PI / 2
      const x = centerX + (radius + 20) * Math.cos(angle)
      const y = centerY + (radius + 20) * Math.sin(angle)
      ctx.fillText(label, x, y)
    })

    // Draw data points
    const values = [sweetness, cleanliness, aroma, body, acidityBitterness]
    ctx.beginPath()
    values.forEach((value, i) => {
      const angle = (Math.PI * 2 * i) / angles - Math.PI / 2
      const x = centerX + ((radius * value) / maxValue) * Math.cos(angle)
      const y = centerY + ((radius * value) / maxValue) * Math.sin(angle)
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.lineTo(
      centerX + ((radius * values[0]) / maxValue) * Math.cos(-Math.PI / 2),
      centerY + ((radius * values[0]) / maxValue) * Math.sin(-Math.PI / 2),
    )
    ctx.fillStyle = "rgba(var(--primary), 0.2)"
    ctx.fill()
    ctx.strokeStyle = "hsl(var(--primary))"
    ctx.stroke()

    // Draw data points
    values.forEach((value, i) => {
      const angle = (Math.PI * 2 * i) / angles - Math.PI / 2
      const x = centerX + ((radius * value) / maxValue) * Math.cos(angle)
      const y = centerY + ((radius * value) / maxValue) * Math.sin(angle)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "hsl(var(--primary))"
      ctx.fill()
    })
  }, [sweetness, cleanliness, aroma, body, acidityBitterness])

  return <canvas ref={canvasRef} className={`w-full aspect-square ${className}`} />
}

