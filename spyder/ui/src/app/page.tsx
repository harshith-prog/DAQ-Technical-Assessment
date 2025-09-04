"use client"

import React, { useEffect } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer } from "lucide-react"
import Numeric from "../components/custom/numeric"
import RedbackLogoDarkMode from "../../public/logo-darkmode.svg"
import RedbackLogoLightMode from "../../public/logo-lightmode.svg"
import { DataProvider, useDataContext } from "../components/custom/data-wrapper"

function PageInner() {
  const { setTheme } = useTheme()
  const { temperature, connectionStatus } = useDataContext()

  useEffect(() => { setTheme("dark") }, [setTheme])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 h-20 flex items-center gap-5 border-b">
        <Image
          src={RedbackLogoDarkMode}
          className="h-12 w-auto"
          alt="Redback Racing Logo"
        />
        <h1 className="text-foreground text-xl font-semibold">DAQ Technical Assessment</h1>
        <Badge variant={connectionStatus === "Connected" ? "success" : "destructive"} className="ml-auto">
          {connectionStatus}
        </Badge>
      </header>
      <main className="flex-grow flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-light flex items-center gap-2">
              <Thermometer className="h-6 w-6" />
              Live Battery Temperature
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Numeric temp={temperature} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <DataProvider>
      <PageInner />
    </DataProvider>
  )
}
