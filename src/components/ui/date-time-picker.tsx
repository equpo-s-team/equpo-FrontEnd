"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FieldLabel } from "@/features/board/components/FieldLabel"

interface DateTimePickerProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: boolean
  required?: boolean
  showLabel?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha y hora",
  className = "",
  error = false,
  required = false,
  showLabel = true,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [time, setTime] = React.useState<string>(
    value ? value.split('T')[1] || "23:59" : "23:59"
  )

  React.useEffect(() => {
    if (value) {
      const newDate = new Date(value)
      if (!isNaN(newDate.getTime())) {
        setDate(newDate)
        setTime(value.split('T')[1] || "23:59")
      }
    } else {
      setDate(undefined)
      setTime("23:59")
    }
  }, [value])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      onChange(`${year}-${month}-${day}T${time}`)
    } else {
      setDate(undefined)
      onChange('')
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      onChange(`${year}-${month}-${day}T${newTime}`)
    } else {
      // If no date selected, default to today
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      onChange(`${year}-${month}-${day}T${newTime}`)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <FieldLabel required={required}>
          Fecha y Hora Límite
        </FieldLabel>
      )}

      <div className="flex gap-2">
        {/* Date Picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`flex-1 justify-between text-left font-normal ${
                error ? 'border-red' : 'border-grey-200 focus:border-blue'
              }`}
            >
              {date ? format(date, "PPP", { locale: es }) : placeholder}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              locale={es}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Time Input */}
        <Input
          type="time"
          value={time}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-24 appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
