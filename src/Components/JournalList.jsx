import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function JournalCard() {
  const { state } = useLocation();
  const selectedDate = state?.selectedDate;

  const [entries, setEntries] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null); // ✅ For showing logic

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
    setSelectedCard(null); // hide logic if deleted
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
            onClick={() => entry && setSelectedCard(entry)} // ✅ on click show logic
            className={`cursor-pointer border p-2 min-h-[80px] sm:min-h-[100px] rounded-md text-sm relative break-words
              ${
                entry
                  ? entry.type === "profit"
                    ? "bg-green-300 border-green-600  "
                    : "bg-red-300 border-red-600"
                  : "border-zinc-700 text-black"
              }
              ${isSelected ? "ring-2 ring-yellow-300" : ""}
            `}
          >
            <div className="font-semibold text-xs sm:text-sm">{displayDate}</div>

            {entry && (
              <div className="text-xs sm:text-sm mt-1 space-y-1">
                <div className="uppercase font-semibold">{entry.type}</div>
                <div>Amount: {entry.amount}$</div>
                <div>Trades: {entry.tradeCount}</div>
              </div>
            )}

            {entry && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening logic popup
                  deleteEntry(formattedDate);
                }}
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
    <div className="p-4 max-w-6xl mx-auto bg-white rounded-lg min-h-screen relative">
      <h2 className="text-xl text-black font-semibold mb-4 text-center">
        {currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
      </h2>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">{generateCalendarCells()}</div>

      {/* ✅ Show trading logic popup */}
      {selectedCard && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2 text-gray-800">Trading Logic</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{selectedCard.tradingLogic || "No logic provided."}</p>
          </div>
        </div>
      )}
    </div>
  );
}
