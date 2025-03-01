"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RatioCalculatorProps {
  ratio: string
  className?: string
}

export default function RatioCalculator({ ratio, className = "" }: RatioCalculatorProps) {
  const [coffeeAmount, setCoffeeAmount] = useState("15")
  const [waterAmount, setWaterAmount] = useState("")

  useEffect(() => {
    const ratioNumber = Number.parseInt(ratio.split(":")[1])
    const coffee = Number.parseFloat(coffeeAmount)
    if (!isNaN(coffee) && !isNaN(ratioNumber)) {
      setWaterAmount((coffee * ratioNumber).toString())
    }
  }, [coffeeAmount, ratio])

  const handleCoffeeChange = (value: string) => {
    setCoffeeAmount(value)
    const ratioNumber = Number.parseInt(ratio.split(":")[1])
    const coffee = Number.parseFloat(value)
    if (!isNaN(coffee) && !isNaN(ratioNumber)) {
      setWaterAmount((coffee * ratioNumber).toString())
    }
  }

  const handleWaterChange = (value: string) => {
    setWaterAmount(value)
    const ratioNumber = Number.parseInt(ratio.split(":")[1])
    const water = Number.parseFloat(value)
    if (!isNaN(water) && !isNaN(ratioNumber)) {
      setCoffeeAmount((water / ratioNumber).toFixed(1))
    }
  }

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="coffee-amount">Coffee</Label>
        <div className="flex items-center gap-2">
          <Input
            id="coffee-amount"
            type="number"
            min="5"
            max="50"
            step="0.1"
            value={coffeeAmount}
            onChange={(e) => handleCoffeeChange(e.target.value)}
          />
          <span className="text-sm text-muted-foreground">g</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="water-amount">Water</Label>
        <div className="flex items-center gap-2">
          <Input
            id="water-amount"
            type="number"
            min="50"
            max="1000"
            value={waterAmount}
            onChange={(e) => handleWaterChange(e.target.value)}
          />
          <span className="text-sm text-muted-foreground">ml</span>
        </div>
      </div>
    </div>
  )
}

