"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Coffee, Trash2, Pencil, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import FlavorWheel from "@/components/flavor-wheel"
import RatioCalculator from "@/components/ratio-calculator"

interface CoffeeBean {
  id: string
  name: string
  roaster: string
  roasterUrl?: string
  roasterImage?: string
  purchaseLink?: string
  origin: string
  originCountry: string
  estate?: string
  altitude: string
  processingMethod: string
  flavorProfile: {
    sweetness: number
    cleanliness: number
    aroma: number
    body: number
    acidityBitterness: number
  }
  recommendedParams: {
    ratio: string
    temperature: number
    time: number
    dripper: string
  }
}

const COFFEE_ORIGINS = [
  {
    region: "Africa",
    countries: [
      { value: "ethiopia", label: "Ethiopia" },
      { value: "kenya", label: "Kenya" },
      { value: "tanzania", label: "Tanzania" },
      { value: "rwanda", label: "Rwanda" },
      { value: "burundi", label: "Burundi" },
      { value: "uganda", label: "Uganda" },
    ],
  },
  {
    region: "Central & South America",
    countries: [
      { value: "guatemala", label: "Guatemala" },
      { value: "costa_rica", label: "Costa Rica" },
      { value: "el_salvador", label: "El Salvador" },
      { value: "honduras", label: "Honduras" },
      { value: "nicaragua", label: "Nicaragua" },
      { value: "panama", label: "Panama" },
      { value: "brazil", label: "Brazil" },
      { value: "colombia", label: "Colombia" },
      { value: "peru", label: "Peru" },
      { value: "bolivia", label: "Bolivia" },
      { value: "ecuador", label: "Ecuador" },
    ],
  },
  {
    region: "Asia & Pacific",
    countries: [
      { value: "indonesia", label: "Indonesia" },
      { value: "india", label: "India" },
      { value: "papua_new_guinea", label: "Papua New Guinea" },
      { value: "yemen", label: "Yemen" },
      { value: "vietnam", label: "Vietnam" },
      { value: "laos", label: "Laos" },
      { value: "thailand", label: "Thailand" },
    ],
  },
  {
    region: "Caribbean",
    countries: [
      { value: "jamaica", label: "Jamaica" },
      { value: "cuba", label: "Cuba" },
      { value: "dominican_republic", label: "Dominican Republic" },
      { value: "haiti", label: "Haiti" },
      { value: "puerto_rico", label: "Puerto Rico" },
    ],
  },
]

const PROCESSING_METHODS = [
  { value: "natural", label: "Natural/Dry Process" },
  { value: "washed", label: "Washed/Wet Process" },
  { value: "honey", label: "Honey/Pulped Natural Process" },
  { value: "anaerobic", label: "Anaerobic Fermentation" },
  { value: "carbonic", label: "Carbonic Maceration" },
  { value: "double", label: "Double Fermentation" },
  { value: "wine", label: "Wine Process" },
] as const

interface BrewingRecord {
  id: string
  timestamp: number
  temperature: number
  ratio: string
  time: number
  dripper: string
  notes: string
}

const sampleCoffeeBean: CoffeeBean = {
  id: "bean123",
  name: "Ethiopia Yirgacheffe",
  roaster: "Heart Coffee Roasters",
  roasterUrl: "https://heartroasters.com",
  roasterImage: "/placeholder.svg?height=150&width=150",
  purchaseLink: "https://heartroasters.com/products/ethiopia-yirgacheffe",
  origin: "Yirgacheffe, Ethiopia",
  originCountry: "ethiopia",
  altitude: "1,800-2,200m",
  processingMethod: "washed",
  flavorProfile: {
    sweetness: 4.2,
    cleanliness: 4.5,
    aroma: 4.8,
    body: 3.5,
    acidityBitterness: 4.0,
  },
  recommendedParams: {
    ratio: "1:15",
    temperature: 92,
    time: 210,
    dripper: "V60",
  },
}

export default function CoffeeBrewingNotes() {
  const [coffeeBean, setCoffeeBean] = useState<CoffeeBean | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Brewing parameters
  const [temperature, setTemperature] = useState(90)
  const [ratio, setRatio] = useState("1:15")
  const [time, setTime] = useState(180)
  const [dripper, setDripper] = useState("")
  const [notes, setNotes] = useState("")

  // Brewing records
  const [brewingRecords, setBrewingRecords] = useState<BrewingRecord[]>([])
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null)

  // Load coffee bean data from localStorage on mount
  useEffect(() => {
    const storedBean = localStorage.getItem("coffee-bean")
    if (storedBean) {
      const parsedBean = JSON.parse(storedBean)
      setCoffeeBean(parsedBean)
      setTemperature(parsedBean.recommendedParams.temperature)
      setRatio(parsedBean.recommendedParams.ratio)
      setTime(parsedBean.recommendedParams.time)
      setDripper(parsedBean.recommendedParams.dripper)
    } else {
      // Load sample coffee bean data if nothing in localStorage
      setCoffeeBean(sampleCoffeeBean)
      setTemperature(sampleCoffeeBean.recommendedParams.temperature)
      setRatio(sampleCoffeeBean.recommendedParams.ratio)
      setTime(sampleCoffeeBean.recommendedParams.time)
      setDripper(sampleCoffeeBean.recommendedParams.dripper)
    }
  }, [])

  // Save coffee bean data to localStorage
  useEffect(() => {
    if (coffeeBean) {
      localStorage.setItem("coffee-bean", JSON.stringify(coffeeBean))
    }
  }, [coffeeBean])

  // Load brewing records from localStorage
  useEffect(() => {
    if (coffeeBean) {
      const storedRecords = localStorage.getItem(`coffee-records-${coffeeBean.id}`)
      if (storedRecords) {
        setBrewingRecords(JSON.parse(storedRecords))
      } else {
        setBrewingRecords([])
      }
    }
  }, [coffeeBean])

  // Save brewing records to localStorage
  useEffect(() => {
    if (coffeeBean && brewingRecords.length > 0) {
      localStorage.setItem(`coffee-records-${coffeeBean.id}`, JSON.stringify(brewingRecords))
    }
  }, [brewingRecords, coffeeBean])

  // Save brewing record
  const handleSave = async () => {
    if (!coffeeBean) {
        console.error("❌ 错误: coffeeBean 为空，无法保存");
        return;
    }

    console.log("📤 发送到 Firebase:", JSON.stringify(coffeeBean, null, 2));

    try {
        const beanRef = ref(database, `coffeeBeans/${coffeeBean.id}`);
        await set(beanRef, coffeeBean);

        console.log("✅ 数据已保存:", coffeeBean);
        alert("咖啡豆信息已成功保存！");
    } catch (error) {
        console.error("❌ 保存失败:", error);
        alert("保存失败，请检查控制台错误信息");
    }
}
  const saveBrewingRecord = () => {
    if (!coffeeBean) {
      toast({
        title: "No Coffee Bean Selected",
        description: "Please scan a coffee bean NFC tag first.",
        variant: "destructive",
      })
      return
    }

    if (brewingRecords.length >= 20) {
      toast({
        title: "Maximum Records Reached",
        description: "You can only save up to 20 brewing records per coffee bean.",
        variant: "destructive",
      })
      return
    }

    const newRecord: BrewingRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      temperature,
      ratio,
      time,
      dripper,
      notes,
    }

    setBrewingRecords([newRecord, ...brewingRecords])

    toast({
      title: "Record Saved",
      description: "Your brewing parameters have been saved successfully.",
    })

    // Reset notes field
    setNotes("")
  }

  // Delete brewing record
  const deleteBrewingRecord = (id: string) => {
    setBrewingRecords(brewingRecords.filter((record) => record.id !== id))
    setRecordToDelete(null)

    toast({
      title: "Record Deleted",
      description: "The brewing record has been deleted.",
    })
  }

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  // Get processing method label
  const getProcessingMethodLabel = (value: string) => {
    return PROCESSING_METHODS.find((method) => method.value === value)?.label || value
  }

  // Get country label from value
  const getCountryLabel = (value: string) => {
    for (const region of COFFEE_ORIGINS) {
      const country = region.countries.find((c) => c.value === value)
      if (country) return country.label
    }
    return value
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}min ${remainingSeconds}sec`
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-center flex items-center gap-2">
          <Coffee className="h-6 w-6" />
          Coffee Brewing Notes
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{coffeeBean?.name || "Coffee Bean Information"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {coffeeBean && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative w-[150px] h-[150px] rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={coffeeBean.roasterImage || "/placeholder.svg?height=150&width=150"}
                    alt={coffeeBean.roaster}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{coffeeBean.roaster}</h3>
                    {coffeeBean.roasterUrl && (
                      <a
                        href={coffeeBean.roasterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  {coffeeBean.purchaseLink && (
                    <a
                      href={coffeeBean.purchaseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Badge variant="outline" className="cursor-pointer">
                        Purchase Link
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Badge>
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Origin:</span> {coffeeBean.origin}
                </div>
                <div>
                  <span className="font-medium">Altitude:</span> {coffeeBean.altitude}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Processing:</span>{" "}
                  {getProcessingMethodLabel(coffeeBean.processingMethod)}
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-medium mb-4 text-center">Cupping Note</h4>
                <FlavorWheel
                  sweetness={coffeeBean.flavorProfile.sweetness}
                  cleanliness={coffeeBean.flavorProfile.cleanliness}
                  aroma={coffeeBean.flavorProfile.aroma}
                  body={coffeeBean.flavorProfile.body}
                  acidityBitterness={coffeeBean.flavorProfile.acidityBitterness}
                  className="max-w-[300px] mx-auto"
                />
              </div>

              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Recommended Parameters:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Ratio:</span> {coffeeBean.recommendedParams.ratio}
                  </div>
                  <div>
                    <span className="font-medium">Temperature:</span> {coffeeBean.recommendedParams.temperature}°C
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {formatTime(coffeeBean.recommendedParams.time)}
                  </div>
                  <div>
                    <span className="font-medium">Dripper:</span> {coffeeBean.recommendedParams.dripper}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Coffee Bean Information</DialogTitle>
            <DialogDescription>Update the coffee bean details and recommended parameters</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 px-6 h-full">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const updatedBean = {
                  ...coffeeBean,
                  name: formData.get("name") as string,
                  roaster: formData.get("roaster") as string,
                  roasterUrl: formData.get("roasterUrl") as string,
                  roasterImage: formData.get("roasterImage") as string,
                  purchaseLink: formData.get("purchaseLink") as string,
                  originCountry: formData.get("originCountry") as string,
                  origin: `${getCountryLabel(formData.get("originCountry") as string)}${
                    formData.get("estate") ? `, ${formData.get("estate")}` : ""
                  }`,
                  estate: formData.get("estate") as string,
                  altitude: formData.get("altitude") as string,
                  processingMethod: formData.get("processingMethod") as string,
                  flavorProfile: {
                    sweetness: Number(formData.get("sweetness")),
                    cleanliness: Number(formData.get("cleanliness")),
                    aroma: Number(formData.get("aroma")),
                    body: Number(formData.get("body")),
                    acidityBitterness: Number(formData.get("acidityBitterness")),
                  },
                  recommendedParams: {
                    ratio: formData.get("ratio") as string,
                    temperature: Number(formData.get("temperature")),
                    time: Number(formData.get("time")),
                    dripper: formData.get("dripper") as string,
                  },
                }
                setCoffeeBean(updatedBean)
                setIsEditing(false)
                toast({
                  title: "Changes Saved",
                  description: "Coffee bean information has been updated.",
                })
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" name="name" defaultValue={coffeeBean?.name} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="roaster" className="text-right">
                    Roaster
                  </Label>
                  <Input
                    id="roaster"
                    name="roaster"
                    defaultValue={coffeeBean?.roaster}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="roasterUrl" className="text-right">
                    Roaster URL
                  </Label>
                  <Input
                    id="roasterUrl"
                    name="roasterUrl"
                    type="url"
                    defaultValue={coffeeBean?.roasterUrl}
                    className="col-span-3"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="roasterImage" className="text-right">
                    Roaster Image
                  </Label>
                  <Input
                    id="roasterImage"
                    name="roasterImage"
                    type="url"
                    defaultValue={coffeeBean?.roasterImage}
                    className="col-span-3"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="purchaseLink" className="text-right">
                    Purchase Link
                  </Label>
                  <Input
                    id="purchaseLink"
                    name="purchaseLink"
                    type="url"
                    defaultValue={coffeeBean?.purchaseLink}
                    className="col-span-3"
                    placeholder="https://example.com/buy"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="originCountry" className="text-right">
                    Origin
                  </Label>
                  <Select name="originCountry" defaultValue={coffeeBean?.originCountry} required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select origin country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COFFEE_ORIGINS.map((region) => (
                        <SelectGroup key={region.region}>
                          <SelectLabel className="px-2 py-1.5 text-sm font-semibold">{region.region}</SelectLabel>
                          <Separator className="my-1" />
                          {region.countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                          {region !== COFFEE_ORIGINS[COFFEE_ORIGINS.length - 1] && <Separator className="my-1" />}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estate" className="text-right">
                    Estate/Farm
                  </Label>
                  <Input
                    id="estate"
                    name="estate"
                    defaultValue={coffeeBean?.estate}
                    className="col-span-3"
                    placeholder="Optional estate or farm name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="altitude" className="text-right">
                    Altitude
                  </Label>
                  <Input
                    id="altitude"
                    name="altitude"
                    defaultValue={coffeeBean?.altitude}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="processingMethod" className="text-right">
                    Processing
                  </Label>
                  <Select name="processingMethod" defaultValue={coffeeBean?.processingMethod} required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select processing method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROCESSING_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rec-ratio" className="text-right">
                    Ratio
                  </Label>
                  <Input
                    id="rec-ratio"
                    name="ratio"
                    defaultValue={coffeeBean?.recommendedParams.ratio}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rec-temp" className="text-right">
                    Temperature (°C)
                  </Label>
                  <Input
                    id="rec-temp"
                    name="temperature"
                    type="number"
                    defaultValue={coffeeBean?.recommendedParams.temperature}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rec-time" className="text-right">
                    Time (seconds)
                  </Label>
                  <Input
                    id="rec-time"
                    name="time"
                    type="number"
                    defaultValue={coffeeBean?.recommendedParams.time}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rec-dripper" className="text-right">
                    Dripper
                  </Label>
                  <Input
                    id="rec-dripper"
                    name="dripper"
                    defaultValue={coffeeBean?.recommendedParams.dripper}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sweetness" className="text-right">
                    Sweetness
                  </Label>
                  <Input
                    id="sweetness"
                    name="sweetness"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    defaultValue={coffeeBean?.flavorProfile.sweetness}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cleanliness" className="text-right">
                    Cleanliness
                  </Label>
                  <Input
                    id="cleanliness"
                    name="cleanliness"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    defaultValue={coffeeBean?.flavorProfile.cleanliness}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="aroma" className="text-right">
                    Aroma
                  </Label>
                  <Input
                    id="aroma"
                    name="aroma"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    defaultValue={coffeeBean?.flavorProfile.aroma}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="body" className="text-right">
                    Body
                  </Label>
                  <Input
                    id="body"
                    name="body"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    defaultValue={coffeeBean?.flavorProfile.body}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="acidityBitterness" className="text-right">
                    Acidity/Bitterness
                  </Label>
                  <Input
                    id="acidityBitterness"
                    name="acidityBitterness"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    defaultValue={coffeeBean?.flavorProfile.acidityBitterness}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Record Brewing</TabsTrigger>
          <TabsTrigger value="history">Brewing History</TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>Brewing Parameters</CardTitle>
              <CardDescription>Record your brewing parameters for {coffeeBean?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature</Label>
                  <span className="text-sm font-medium">{temperature}°C</span>
                </div>
                <Slider
                  id="temperature"
                  min={70}
                  max={100}
                  step={1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
              </div>
              <div className="space-y-2">
                <Label>Ratio Calculator</Label>
                <RatioCalculator ratio={ratio} className="mt-2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ratio">Coffee to Water Ratio (1:x)</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">1:</span>
                  <Input
                    id="ratio"
                    type="number"
                    min="10"
                    max="20"
                    value={ratio.split(":")[1]}
                    onChange={(e) => setRatio(`1:${e.target.value}`)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="time">Brewing Time</Label>
                  <span className="text-sm font-medium">{formatTime(time)}</span>
                </div>
                <Slider
                  id="time"
                  min={60}
                  max={300}
                  step={5}
                  value={[time]}
                  onValueChange={(value) => setTime(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dripper">Dripper</Label>
                <Input
                  id="dripper"
                  value={dripper}
                  onChange={(e) => setDripper(e.target.value)}
                  placeholder="V60, Kalita, Chemex, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Tasting Notes & Experience</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your experience, flavor notes, etc."
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveBrewingRecord} className="w-full" disabled={brewingRecords.length >= 20}>
                Save Brewing Record
              </Button>
            </CardFooter>
            {brewingRecords.length >= 20 && (
              <div className="px-6 pb-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Maximum Records Reached</AlertTitle>
                  <AlertDescription>You can only save up to 20 brewing records per coffee bean.</AlertDescription>
                </Alert>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Brewing History</CardTitle>
              <CardDescription>Your brewing records for {coffeeBean?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {brewingRecords.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No brewing records yet</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {brewingRecords.map((record, index) => (
                      <Card key={record.id} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">Brew #{brewingRecords.length - index}</CardTitle>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setRecordToDelete(record.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Brewing Record</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this brewing record? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setRecordToDelete(null)}>
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" onClick={() => deleteBrewingRecord(record.id)}>
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <CardDescription>{formatDate(record.timestamp)}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                            <div>
                              <span className="font-medium">Temperature:</span> {record.temperature}°C
                            </div>
                            <div>
                              <span className="font-medium">Ratio:</span> {record.ratio}
                            </div>
                            <div>
                              <span className="font-medium">Time:</span> {formatTime(record.time)}
                            </div>
                            <div>
                              <span className="font-medium">Dripper:</span> {record.dripper}
                            </div>
                          </div>
                          {record.notes && (
                            <div className="mt-2 pt-2 border-t text-sm">
                              <p className="font-medium mb-1">Notes:</p>
                              <p className="text-muted-foreground">{record.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}

