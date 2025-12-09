import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from "date-fns";

interface DateRangePickerProps {
  departDate: Date | undefined;
  returnDate: Date | undefined;
  onDepartDateChange: (date: Date | undefined) => void;
  onReturnDateChange: (date: Date | undefined) => void;
  mode: 'single' | 'range';
  placeholder?: string;
}

const DateRangePicker = ({
  departDate,
  returnDate,
  onDepartDateChange,
  onReturnDateChange,
  mode,
  placeholder = "Select dates"
}: DateRangePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectingReturn, setSelectingReturn] = useState(false);

  const today = startOfToday();
  const nextMonth = addMonths(currentMonth, 1);

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const handleDateClick = (date: Date) => {
    if (mode === 'single') {
      onDepartDateChange(date);
      setIsOpen(false);
      return;
    }

    // Range mode
    if (!departDate || selectingReturn) {
      if (selectingReturn && departDate && date >= departDate) {
        onReturnDateChange(date);
        setSelectingReturn(false);
        setIsOpen(false);
      } else {
        onDepartDateChange(date);
        onReturnDateChange(undefined);
        setSelectingReturn(true);
      }
    } else {
      if (date >= departDate) {
        onReturnDateChange(date);
        setSelectingReturn(false);
        setIsOpen(false);
      } else {
        onDepartDateChange(date);
        onReturnDateChange(undefined);
        setSelectingReturn(true);
      }
    }
  };

  const isInRange = (date: Date) => {
    if (!departDate || !returnDate) return false;
    return date > departDate && date < returnDate;
  };

  const isRangeStart = (date: Date) => departDate && isSameDay(date, departDate);
  const isRangeEnd = (date: Date) => returnDate && isSameDay(date, returnDate);

  const renderMonth = (monthDate: Date) => {
    const days = getDaysInMonth(monthDate);
    const firstDayOfMonth = startOfMonth(monthDate);
    const startingDayOfWeek = firstDayOfMonth.getDay();

    return (
      <div className="p-4">
        <div className="text-center font-semibold text-foreground mb-4">
          {format(monthDate, 'MMMM yyyy')}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}
          {/* Days of the month */}
          {days.map(day => {
            const isPast = isBefore(day, today);
            const isDisabled = isPast;
            const isSelected = isRangeStart(day) || isRangeEnd(day);
            const inRange = isInRange(day);
            const isTodayDate = isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isDisabled && handleDateClick(day)}
                disabled={isDisabled}
                className={cn(
                  "h-9 w-full rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  isDisabled && "opacity-30 cursor-not-allowed hover:bg-transparent",
                  isTodayDate && !isSelected && "border-2 border-primary/30",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                  inRange && "bg-primary/20 rounded-none",
                  isRangeStart(day) && returnDate && "rounded-r-none",
                  isRangeEnd(day) && departDate && "rounded-l-none"
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const displayText = () => {
    if (mode === 'single' && departDate) {
      return format(departDate, 'EEE, MMM d, yyyy');
    }
    if (mode === 'range') {
      if (departDate && returnDate) {
        return `${format(departDate, 'MMM d')} - ${format(returnDate, 'MMM d, yyyy')}`;
      }
      if (departDate) {
        return `${format(departDate, 'MMM d')} - Select return`;
      }
    }
    return placeholder;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-11 hover:border-primary transition-colors",
            (!departDate && !returnDate) && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          {displayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 pointer-events-auto shadow-elevated animate-scale-in" 
        align="start"
      >
        <div className="bg-card rounded-xl overflow-hidden">
          {/* Navigation */}
          <div className="flex items-center justify-between px-4 pt-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-sm text-muted-foreground">
              {mode === 'range' && (
                selectingReturn ? 'Select return date' : 'Select departure date'
              )}
            </div>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendars */}
          <div className="flex flex-col md:flex-row">
            {renderMonth(currentMonth)}
            {mode === 'range' && (
              <div className="border-t md:border-t-0 md:border-l border-border">
                {renderMonth(nextMonth)}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-border p-3 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDepartDateChange(today);
                if (mode === 'single') setIsOpen(false);
              }}
              className="text-xs"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDepartDateChange(addMonths(today, 0));
                onReturnDateChange(addMonths(today, 0));
              }}
              className="text-xs"
            >
              This Week
            </Button>
            {(departDate || returnDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onDepartDateChange(undefined);
                  onReturnDateChange(undefined);
                  setSelectingReturn(false);
                }}
                className="text-xs text-destructive ml-auto"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;