import React, {useState, useEffect, useRef, JSX} from 'react';

const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

interface DatePickerProps {
    onRangeChange: (start: Date | null, end: Date | null, days: number) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({onRangeChange}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(() => {
        const d = new Date();
        d.setDate(d.getDate() - 29);
        return d;
    });
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [activePreset, setActivePreset] = useState<number>(30);
    const [picking, setPicking] = useState(true); // true = start, false = end
    const [calendarMonth, setCalendarMonth] = useState(() => {
        const d = new Date();
        d.setDate(1);
        return d;
    });

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Format date
    const formatDate = (date: Date | null) => {
        if (!date) return '—';
        return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3).toLowerCase()} ${date.getFullYear()}`;
    };

    const formatISO = (date: Date | null) => {
        if (!date) return '';
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const syncUI = () => {
        const label = document.getElementById('triggerLabel');
        const rangeSpan = document.getElementById('triggerRange');
        const ddRange = document.getElementById('ddRange');
        const fromInput = document.getElementById('dateFrom') as HTMLInputElement;
        const toInput = document.getElementById('dateTo') as HTMLInputElement;

        if (label) {
            const active = document.querySelector('.preset-btn.active');
            label.textContent = active ? active.textContent : 'Personalizado';
        }
        const rangeStr = startDate && endDate ? `${formatDate(startDate)} – ${formatDate(endDate)}` : startDate ? formatDate(startDate) : '—';
        if (rangeSpan) rangeSpan.textContent = rangeStr;
        if (ddRange) ddRange.textContent = rangeStr;
        if (fromInput) fromInput.value = formatISO(startDate);
        if (toInput) toInput.value = formatISO(endDate);
    };

    useEffect(() => {
        syncUI();
        // Notify parent
        if (startDate && endDate) {
            const days = Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1;
            onRangeChange(startDate, endDate, days);
        }
    }, [startDate, endDate]);

    // Handle preset click
    const handlePreset = (days: number) => {
        setActivePreset(days);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newStart = new Date(today);
        newStart.setDate(today.getDate() - (days - 1));
        setStartDate(newStart);
        setEndDate(today);
        setIsOpen(false);
    };

    // Calendar rendering
    const renderCalendar = () => {
        const grid: JSX.Element[] = [];
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        let startWeekday = firstDay.getDay();
        startWeekday = startWeekday === 0 ? 6 : startWeekday - 1; // Monday first

        // Weekday headers
        const weekdays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
        weekdays.forEach(day => {
            grid.push(<div key={`dow-${day}`} className="cal-dow">{day}</div>);
        });

        // Empty cells before first day
        for (let i = 0; i < startWeekday; i++) {
            grid.push(<div key={`empty-${i}`} className="cal-day empty"></div>);
        }

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const isToday = date.toDateString() === new Date().toDateString();
            const isStart = startDate && date.toDateString() === startDate.toDateString();
            const isEnd = endDate && date.toDateString() === endDate.toDateString();
            const isInRange = startDate && endDate && date > startDate && date < endDate;

            let className = 'cal-day';
            if (isStart) className += ' range-start';
            else if (isEnd) className += ' range-end';
            else if (isInRange) className += ' in-range';
            else if (isToday) className += ' today';

            grid.push(
                <div
                    key={d}
                    className={className}
                    onClick={() => {
                        if (picking) {
                            setStartDate(date);
                            setEndDate(null);
                            setPicking(false);
                        } else {
                            if (date < (startDate || date)) {
                                setEndDate(startDate);
                                setStartDate(date);
                            } else {
                                setEndDate(date);
                            }
                            setPicking(true);
                        }
                        // Remove preset active class
                        setActivePreset(0);
                    }}
                >
                    {d}
                </div>
            );
        }

        return grid;
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="date-picker-wrap" ref={wrapperRef}>
            <div
                className={`date-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span style={{fontSize: '.85rem'}}>📅</span>
                <span className="date-trigger-label" id="triggerLabel">
          {activePreset === 30 ? 'Últimos 30 días' : activePreset === 7 ? 'Esta semana' : activePreset === 90 ? 'Trimestre' : activePreset === 180 ? 'Semestre' : activePreset === 365 ? 'Este año' : 'Personalizado'}
        </span>
                <span className="date-trigger-range" id="triggerRange">
          {startDate && endDate ? `${formatDate(startDate)} – ${formatDate(endDate)}` : '—'}
        </span>
                <span className="date-arrow">▼</span>
            </div>

            {isOpen && (
                <div className="date-dropdown open">
                    <div className="dd-presets">
                        <button className={`preset-btn ${activePreset === 7 ? 'active' : ''}`}
                                onClick={() => handlePreset(7)}>Esta semana
                        </button>
                        <button className={`preset-btn ${activePreset === 30 ? 'active' : ''}`}
                                onClick={() => handlePreset(30)}>Últ. 30 días
                        </button>
                        <button className={`preset-btn ${activePreset === 90 ? 'active' : ''}`}
                                onClick={() => handlePreset(90)}>Trimestre
                        </button>
                        <button className={`preset-btn ${activePreset === 180 ? 'active' : ''}`}
                                onClick={() => handlePreset(180)}>Semestre
                        </button>
                        <button className={`preset-btn ${activePreset === 365 ? 'active' : ''}`}
                                onClick={() => handlePreset(365)}>Este año
                        </button>
                        <button className={`preset-btn ${activePreset === 0 ? 'active' : ''}`}
                                onClick={() => setActivePreset(0)}>Personalizado
                        </button>
                    </div>

                    <div className="dd-custom">
                        <div className="dd-custom-label">Rango personalizado</div>
                        <div className="dd-custom-row">
                            <input
                                type="date"
                                className="date-input"
                                id="dateFrom"
                                value={formatISO(startDate)}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setStartDate(new Date(e.target.value + 'T00:00:00'));
                                        setActivePreset(0);
                                    }
                                }}
                            />
                            <span>→</span>
                            <input
                                type="date"
                                className="date-input"
                                id="dateTo"
                                value={formatISO(endDate)}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setEndDate(new Date(e.target.value + 'T00:00:00'));
                                        setActivePreset(0);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="dd-calendar">
                        <div className="cal-nav">
                            <button
                                className="cal-nav-btn"
                                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                            >
                                ‹
                            </button>
                            <span className="cal-month-label">
                {MONTHS[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
              </span>
                            <button
                                className="cal-nav-btn"
                                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                            >
                                ›
                            </button>
                        </div>
                        <div className="cal-grid">{renderCalendar()}</div>
                    </div>

                    <div className="dd-footer">
            <span className="dd-sel-range" id="ddRange">
              {startDate && endDate ? `${formatDate(startDate)} – ${formatDate(endDate)}` : '—'}
            </span>
                        <div className="dd-btns">
                            <button
                                className="dd-clear"
                                onClick={() => {
                                    setStartDate(null);
                                    setEndDate(null);
                                    setActivePreset(0);
                                }}
                            >
                                Limpiar
                            </button>
                            <button
                                className="dd-apply"
                                onClick={() => {
                                    setIsOpen(false);
                                    if (startDate && endDate) {
                                        const days = Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1;
                                        onRangeChange(startDate, endDate, days);
                                    }
                                }}
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;