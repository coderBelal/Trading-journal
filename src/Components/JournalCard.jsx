import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function JournalCard() {
  const { state } = useLocation();
  const selectedDate = state?.selectedDate;

  const [entries, setEntries] = useState([]);

  // Load entries from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("journalEntries")) || [];
    setEntries(stored);
  }, []);

  const getEntryByDate = (dateString) => {
    return entries.find((entry) => entry.date === dateString);
  };

  const deleteEntry = (dateString) => {
    const updated = entries.filter((entry) => entry.date !== dateString);
    setEntries(updated);
    localStorage.setItem("journalEntries", JSON.stringify(updated));
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDate = new Date(year, month, 1);
  const firstDayOfMonth = calendarDate.getDay();
  const offset = (firstDayOfMonth + 6) % 7;
  const totalCells = offset + daysInMonth;
  const weeks = Math.ceil(totalCells / 7);

  const generateCalendarCells = () => {
    const cells = [];

    for (let i = 0; i < weeks * 7; i++) {
      const dateNumber = i - offset + 1;

      if (dateNumber > 0 && dateNumber <= daysInMonth) {
        const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          dateNumber
        ).padStart(2, "0")}`;
        const entry = getEntryByDate(formattedDate);
        const isSelected = formattedDate === selectedDate;

        const displayDate = new Date(year, month, dateNumber).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        cells.push(
          <div
            key={i}
            className={`border p-2 min-h-[80px] sm:min-h-[100px] rounded-md text-sm relative break-words
              ${
                entry
                  ? entry.type === "profit"
                    ? "bg-green-900 border-green-600 text-green-300"
                    : "bg-red-900 border-red-600 text-red-300"
                  : "  border-zinc-700 text-gray-200"
              }
              ${isSelected ? " " : ""}
            `}
          >
            {/* Date Label */}
            <div className="font-semibold text-xs sm:text-sm">{displayDate}</div>

            {/* Entry Data */}
            {entry && (
              <div className="text-xs sm:text-sm mt-1 space-y-1">
                <div className="uppercase font-semibold">{entry.type}</div>
                <div>Amount: {entry.amount}$</div>
                <div>Trades: {entry.tradeCount}</div>
              </div>
            )}

            {/* Delete Button */}
            {entry && (
              <button
                onClick={() => deleteEntry(formattedDate)}
                className="absolute top-1 right-1 text-red-400 hover:text-red-200 text-xs"
                title="Delete Entry"
              >
                🗑️
              </button>
            )}

       
          </div>
        );
      } else {
        cells.push(
          <div
            key={i}
            className="border p-2 min-h-[80px] sm:min-h-[100px] bg-white rounded-md border-zinc-700"
          ></div>
        );
      }
    }

    return cells;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto  bg-white  rounded-lg min-h-screen">
      <h2 className="text-xl text-black font-semibold mb-4 text-center">
        {currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
      </h2>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">{generateCalendarCells()}</div>

    </div>

  );
}
