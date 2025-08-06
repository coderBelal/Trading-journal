import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddJournalEntry() {
  const [date, setDate] = useState("");
  const [tradeCount, setTradeCount] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("profit");
  const [tradingLogic, setTradingLogic] = useState(""); // ✅ New State

  const navigate = useNavigate();

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      date,
      tradeCount,
      amount,
      type,
      tradingLogic, // ✅ Include in entry
    };

    const existingData = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const updatedData = [...existingData, newEntry];
    localStorage.setItem("journalEntries", JSON.stringify(updatedData));

    navigate("/journals", { state: { selectedDate: date } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md border border-gray-300"
      >
        <button
          type="button"
          onClick={() => navigate("/journals")}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
        >
          Go to Journal
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Add Journal Entry
        </h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 mb-1 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {formattedDate && (
          <p className="mb-4 text-gray-600 italic text-sm">{formattedDate}</p>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">Trade Count</label>
        <input
          type="number"
          placeholder="Enter total trades"
          value={tradeCount}
          onChange={(e) => setTradeCount(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Amount ($)</label>
        <input
          type="number"
          placeholder="Enter profit or loss amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="profit">Profit</option>
          <option value="loss">Loss</option>
        </select>

        {/* ✅ New Input for Trading Logic */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Trading Logic</label>
        <textarea
          placeholder="Explain your trading logic or reason..."
          value={tradingLogic}
          onChange={(e) => setTradingLogic(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 mb-6 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
}
