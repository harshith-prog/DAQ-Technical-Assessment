"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"

const WS_URL = "ws://localhost:8080"

interface VehicleData {
  battery_temperature: number
  timestamp: number
}

interface DataContextType {
  temperature: number
  connectionStatus: string
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function useDataContext() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useDataContext must be used within a DataProvider")
  return ctx
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [temperature, setTemperature] = useState<number>(0)
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected")
  const { lastJsonMessage, readyState }: { lastJsonMessage: VehicleData | null; readyState: ReadyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )

  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        setConnectionStatus("Connected")
        break
      case ReadyState.CLOSED:
        setConnectionStatus("Disconnected")
        break
      case ReadyState.CONNECTING:
        setConnectionStatus("Connecting")
        break
      default:
        setConnectionStatus("Disconnected")
        break
    }
  }, [readyState])

  useEffect(() => {
    if (lastJsonMessage === null) return
    setTemperature(lastJsonMessage.battery_temperature)
  }, [lastJsonMessage])

  return (
    <DataContext.Provider value={{ temperature, connectionStatus }}>
      {children}
    </DataContext.Provider>
  )
}
