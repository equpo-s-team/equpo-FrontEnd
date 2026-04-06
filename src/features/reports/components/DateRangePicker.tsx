/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import { useEffect, useRef, useState } from 'react'

import { DATE_PRESETS } from '../data/datePresets.ts';
import { fmtISO, useDateRange } from '../hooks';
import type { DatePreset } from '../types/types.ts';

const MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]
const DAYS_ES = ['Lu','Ma','Mi','Ju','Vi','Sá','Do']

interface DateRangePickerProps {
  onRangeChange?: (days: number) => void
}

export function DateRangePicker({ onRangeChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [activePreset, setActivePreset] = useState<DatePreset>(DATE_PRESETS[1])
  const wrapRef = useRef<HTMLDivElement>(null)

  const {
    range,
    calMonth,
    rangeLabel,
    setRange,
    applyPreset,
    handleCalDayClick,
    prevMonth,
    nextMonth,
    clearRange,
  } = useDateRange(30)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handlePreset(preset: DatePreset) {
    setActivePreset(preset)
    if (preset.days > 0) {
      applyPreset(preset.days)
      onRangeChange?.(preset.days)
    }
  }

  function handleApply() {
    setOpen(false)
    if (range.start && range.end) {
      const days = Math.round((range.end.getTime() - range.start.getTime()) / 86_400_000) + 1
      onRangeChange?.(days)
    }
  }

  // Build calendar days
  const today = new Date(); today.setHours(0,0,0,0)
  const firstDay = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1)
  let startDow = firstDay.getDay()
  startDow = startDow === 0 ? 6 : startDow - 1

  const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate()

  const isRangeStart = (d: Date) => range.start?.toDateString() === d.toDateString()
  const isRangeEnd   = (d: Date) => range.end?.toDateString() === d.toDateString()
  const isInRange    = (d: Date) =>
    range.start && range.end && d > range.start && d < range.end

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2.5 bg-white border rounded-xl px-4 py-2.5 cursor-pointer
          shadow-sm transition-all duration-200 select-none text-left
          ${open
            ? 'border-[rgba(96,175,255,0.6)] shadow-[0_0_0_3px_rgba(96,175,255,0.15),0_0_18px_rgba(96,175,255,0.12)]'
            : 'border-grey-200 hover:border-[rgba(96,175,255,0.5)] hover:shadow-[0_0_0_3px_rgba(96,175,255,0.1)]'
          }`}
      >
        <span className="text-sm">📅</span>
        <span className="text-sm font-medium text-grey-700 whitespace-nowrap">
          {activePreset.label}
        </span>
        <span className="text-xs text-grey-400 pl-2.5 border-l border-grey-200 whitespace-nowrap hidden sm:block">
          {rangeLabel}
        </span>
        <span
          className="text-[0.6rem] text-grey-400 ml-1 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        >
          ▼
        </span>
      </button>

      {/* Dropdown */}
      <div
        className={`absolute top-[calc(100%+10px)] right-0 bg-white border border-grey-200 rounded-2xl
          shadow-[0_12px_48px_rgba(0,0,0,0.10),0_0_0_1px_rgba(96,175,255,0.06),0_0_40px_rgba(96,175,255,0.06)]
          z-50 w-[340px] sm:w-[390px] overflow-hidden transition-all duration-200
          ${open ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-2 scale-[0.97] pointer-events-none'}`}
      >
        {/* Presets */}
        <div className="grid grid-cols-3 gap-1.5 p-4 pb-3 border-b border-grey-100">
          {DATE_PRESETS.map(preset => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset)}
              className={`py-2 px-1 rounded-lg border text-center text-xs font-medium transition-all duration-150
                ${activePreset.label === preset.label
                  ? 'bg-grey-900 text-white border-grey-900 shadow-[0_0_14px_rgba(26,24,21,0.2)]'
                  : 'bg-grey-50 text-grey-600 border-grey-150 hover:bg-white hover:border-[rgba(96,175,255,0.4)] hover:text-grey-900'
                }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom range inputs */}
        <div className="px-4 pt-3.5">
          <p className="text-[0.67rem] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-2.5">
            Rango personalizado
          </p>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              type="date"
              value={fmtISO(range.start)}
              onChange={e => {
                if (e.target.value) {
                  setRange({ ...range, start: new Date(e.target.value + 'T00:00:00') })
                  setActivePreset(DATE_PRESETS[5])
                }
              }}
              className="w-full px-2.5 py-2 border border-grey-200 rounded-lg
                text-xs text-grey-800 bg-grey-50 outline-none
                focus:border-[rgba(96,175,255,0.5)] focus:shadow-[0_0_0_3px_rgba(96,175,255,0.1)] focus:bg-white
                transition-all"
            />
            <span className="text-xs text-grey-400 text-center">→</span>
            <input
              type="date"
              value={fmtISO(range.end)}
              onChange={e => {
                if (e.target.value) {
                  setRange({ ...range, end: new Date(e.target.value + 'T00:00:00') })
                  setActivePreset(DATE_PRESETS[5])
                }
              }}
              className="w-full px-2.5 py-2 border border-grey-200 rounded-lg
                text-xs text-grey-800 bg-grey-50 outline-none
                focus:border-[rgba(96,175,255,0.5)] focus:shadow-[0_0_0_3px_rgba(96,175,255,0.1)] focus:bg-white
                transition-all"
            />
          </div>
        </div>

        {/* Mini calendar */}
        <div className="px-4 pb-1">
          <div className="flex items-center justify-between my-3.5">
            <button
              onClick={prevMonth}
              className="w-7 h-7 rounded-lg border border-grey-150 bg-grey-50 text-grey-600
                flex items-center justify-center text-sm hover:bg-white hover:border-grey-300 transition-all"
            >
              ‹
            </button>
            <span className="text-[0.82rem] font-semibold text-grey-800">
              {MONTHS_ES[calMonth.getMonth()]} {calMonth.getFullYear()}
            </span>
            <button
              onClick={nextMonth}
              className="w-7 h-7 rounded-lg border border-grey-150 bg-grey-50 text-grey-600
                flex items-center justify-center text-sm hover:bg-white hover:border-grey-300 transition-all"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {/* Day headers */}
            {DAYS_ES.map(d => (
              <div key={d} className="text-center text-[0.61rem] font-semibold uppercase tracking-wider text-grey-400 py-1">
                {d}
              </div>
            ))}

            {/* Empty cells */}
            {Array.from({ length: startDow }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1
              const date = new Date(calMonth.getFullYear(), calMonth.getMonth(), d)
              const isTd  = date.toDateString() === today.toDateString()
              const isS   = isRangeStart(date)
              const isE   = isRangeEnd(date)
              const inR   = isInRange(date)

              let cls = 'aspect-square flex items-center justify-center text-[0.72rem] rounded-lg cursor-pointer transition-all duration-100 '

              if (isS || isE) {
                cls += 'bg-grey-900 text-white font-semibold shadow-[0_0_10px_rgba(96,175,255,0.3)]'
              } else if (inR) {
                cls += 'bg-[rgba(96,175,255,0.09)] text-[#60AFFF]'
              } else if (isTd) {
                cls += 'font-bold text-[#5961F9]'
              } else {
                cls += 'text-grey-700 hover:bg-grey-100'
              }

              return (
                <div key={d} className={cls} onClick={() => handleCalDayClick(date)}>
                  {d}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-grey-100 gap-2.5">
          <span className="text-xs text-grey-500">{rangeLabel}</span>
          <div className="flex gap-2">
            <button
              onClick={clearRange}
              className="px-3.5 py-1.5 text-xs text-grey-500 border border-grey-200 rounded-lg hover:text-grey-800 hover:border-grey-300 transition-all"
            >
              Limpiar
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 bg-grey-900 text-white text-xs font-medium rounded-lg
                transition-all hover:shadow-[0_0_20px_rgba(96,175,255,0.35)]"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
