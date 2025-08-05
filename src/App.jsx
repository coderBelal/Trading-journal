import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddJournalEntry from "./Components/AddJournalEntry";
import JournalList from "./Components/JournalList";
import JournalCard from "./Components/JournalCard";
 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddJournalEntry />} />
        <Route path="/journals" element={<JournalList />} />
        <Route path="/journal-card" element={<JournalCard />} /> {/* Optional */}
      </Routes>
    </Router>
  );
}

export default App;
