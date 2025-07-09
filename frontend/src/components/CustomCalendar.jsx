import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function CustomCalendar({ selected, onSelect }) {
  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <DayPicker mode="single" selected={selected} onSelect={onSelect} />
    </div>
  );
}
