import { useCallback, useState } from 'react'

import type { DateRange } from '../types/types.ts';

const MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

export function fmtDate(d: Date | null): string {
  if (!d) return '—'
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()].slice(0, 3).toLowerCase()} ${d.getFullYear()}`
}

export function fmtISO(d: Date | null): string {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round(Math.abs(b.getTime() - a.getTime()) / 86_400_000) + 1
}

function startOfDay(d: Date): Date {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function daysAgo(n: number): Date {
  const today = startOfDay(new Date())
  today.setDate(today.getDate() - n)
  return today
}

interface UseDateRangeReturn {
  range: DateRange
  calMonth: Date
  pickingStart: boolean
  rangeLabel: string
  setRange: (r: DateRange) => void
  applyPreset: (days: number) => void
  handleCalDayClick: (date: Date) => void
  prevMonth: () => void
  nextMonth: () => void
  clearRange: () => void
}

export function useDateRange(defaultDays = 30): UseDateRangeReturn {
  const today = startOfDay(new Date())

  const [range, setRange] = useState<DateRange>({
    start: daysAgo(defaultDays - 1),
    end:   today,
  })
  const [calMonth, setCalMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [pickingStart, setPickingStart] = useState(true)

  const rangeLabel =
    range.start && range.end
      ? `${fmtDate(range.start)} – ${fmtDate(range.end)}`
      : range.start
      ? fmtDate(range.start)
      : '—'

  const applyPreset = useCallback((days: number) => {
    if (days === 0) return
    setRange({ start: daysAgo(days - 1), end: today })
    setPickingStart(true)
  }, [])

  const handleCalDayClick = useCallback((date: Date) => {
    if (pickingStart) {
      setRange({ start: date, end: null })
      setPickingStart(false)
    } else {
      if (!range.start || date < range.start) {
        setRange({ start: date, end: range.start })
      } else {
        setRange(prev => ({ ...prev, end: date }))
      }
      setPickingStart(true)
    }
  }, [pickingStart, range.start])

  const prevMonth = useCallback(() => {
    setCalMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }, [])

  const nextMonth = useCallback(() => {
    setCalMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }, [])

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null })
    setPickingStart(true)
  }, [])

  return {
    range,
    calMonth,
    pickingStart,
    rangeLabel,
    setRange,
    applyPreset,
    handleCalDayClick,
    prevMonth,
    nextMonth,
    clearRange,
  }
}
