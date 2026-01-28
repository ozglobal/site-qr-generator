import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/layout/AppHeader"
import { AppBottomNav, NavItem } from "@/components/layout/AppBottomNav"
import { MonthSelector, ViewMode } from "@/components/ui/MonthSelector"
import { SiteCombobox, SiteOption } from "@/components/ui/SiteCombobox"
import { Calendar, type CalendarEvent } from "@/components/ui/calendar"
import { ko } from "react-day-picker/locale"
import { fetchMonthlyAttendance, type WeeklyAttendanceRecord } from "@/lib/attendance"

const siteOptions: SiteOption[] = [
  { value: "site-a", label: "현장 A" },
  { value: "site-b", label: "현장 B" },
]

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1

const SITE_COLORS = ["#007DCA", "#F59E0B", "#10B981", "#EF4444"]

function recordsToEvents(records: WeeklyAttendanceRecord[]): CalendarEvent[] {
  const siteIndexMap = new Map<string, number>()
  const checkedIn = records.filter((r) => r.hasCheckedIn)
  checkedIn.forEach((r) => {
    if (!siteIndexMap.has(r.siteId)) siteIndexMap.set(r.siteId, siteIndexMap.size)
  })
  return checkedIn.map((r) => ({
    date: new Date(r.effectiveDate),
    color: SITE_COLORS[(siteIndexMap.get(r.siteId) ?? 0) % SITE_COLORS.length],
    label: r.workEffort != null ? String(r.workEffort) : "",
  }))
}

export function AttendancePage() {
  const navigate = useNavigate()
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)
  const [viewMode, setViewMode] = useState<ViewMode>("calendar")
  const [selectedSite, setSelectedSite] = useState("")
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    const offset = (currentYear - year) * 12 + (currentMonth - month)
    console.log('[ATTENDANCE] useEffect fired, offset:', offset)
    fetchMonthlyAttendance(offset).then((res) => {
      if (res.success && res.data) {
        setEvents(recordsToEvents(res.data.records))
      }
    })
  }, [year, month])

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear(year - 1)
      setMonth(12)
    } else {
      setMonth(month - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 12) {
      setYear(year + 1)
      setMonth(1)
    } else {
      setMonth(month + 1)
    }
  }

  const handleNavigation = (item: NavItem) => {
    if (item === "home") {
      navigate("/home")
    } else if (item === "profile") {
      navigate("/profile")
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AppHeader showLeftAction={false} title="시재건설" showRightAction={true} className="shrink-0" />

      <MonthSelector
        year={year}
        month={month}
        viewMode={viewMode}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onViewModeChange={setViewMode}
        className="shrink-0"
      />

      <div className="px-4 shrink-0">
        <SiteCombobox
          options={siteOptions}
          value={selectedSite}
          onChange={setSelectedSite}
        />
      </div>

      <div className="flex-1 overflow-y-auto mt-3">
        {viewMode === "calendar" && (
          <Calendar
            mode="single"
            month={new Date(year, month - 1)}
            onMonthChange={(d) => {
              setYear(d.getFullYear())
              setMonth(d.getMonth() + 1)
            }}
            locale={ko}
            events={events}
            className="w-full"
          />
        )}
      </div>

      <AppBottomNav active="attendance" className="shrink-0" onNavigate={handleNavigation} />
    </div>
  )
}
