import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface CalendarDayProps {
  day: number | string;
  isHeader?: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, isHeader }) => {
  const randomBgHighlight =
    !isHeader && Math.random() < 0.3
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground";

  return (
    <div
      className={`col-span-1 row-span-1 flex h-8 w-8 items-center justify-center ${
        isHeader ? "" : "rounded-xl"
      } ${randomBgHighlight}`}
    >
      <span className={`font-medium ${isHeader ? "text-xs" : "text-sm"}`}>
        {day}
      </span>
    </div>
  );
};

export function Calendar() {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const renderCalendarDays = () => {
    const days: React.ReactNode[] = [
      ...dayNames.map((day) => (
        <CalendarDay key={`header-${day}`} day={day} isHeader />
      )),
      ...Array(firstDayOfWeek)
        .fill(null)
        .map((_, i) => (
          <div
            key={`empty-start-${i}`}
            className="col-span-1 row-span-1 h-8 w-8"
          />
        )),
      ...Array(daysInMonth)
        .fill(null)
        .map((_, i) => <CalendarDay key={`date-${i + 1}`} day={i + 1} />),
    ];
    return days;
  };

  return (
    <Card className="group relative backdrop-blur-xl bg-card/95 border-border p-6 hover:bg-primary/5 transition-all duration-300">
      <div className="grid h-full gap-5">
        <div>
          <h2 className="mb-4 text-lg md:text-3xl font-semibold text-foreground">
            Schedule a Meeting
          </h2>
          <p className="mb-2 text-xs md:text-md text-muted-foreground">
            Book a time slot for your next meeting
          </p>
          <Button className="mt-3 rounded-2xl">Book Now</Button>
        </div>
        <div className="transition-all duration-500 ease-out">
          <div>
            <div className="h-full w-full max-w-[550px] rounded-[24px] border border-border p-2 transition-colors duration-100 group-hover:border-primary/50">
              <div
                className="h-full rounded-2xl border-2 border-border/10 p-3"
                style={{ boxShadow: "0px 2px 1.5px 0px rgba(165, 174, 184, 0.32) inset" }}
              >
                <div className="flex items-center space-x-2">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">
                      {currentMonth}, {currentYear}
                    </span>
                  </p>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground">&nbsp;</span>
                  <p className="text-xs text-muted-foreground">30 min call</p>
                </div>
                <div className="mt-4 grid grid-cols-7 grid-rows-5 gap-2 px-4">
                  {renderCalendarDays()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
