import { Input } from "../ui/input";

type ErgFormProps = {
  distance: number;
  setDistance: (value: number) => void;
  time: number;
  setTime: (value: number) => void;
  pace: string;
  setPace: (value: string) => void;
  rpe: number;
  setRpe: (value: number) => void;
};

const ErgForm: React.FC<ErgFormProps> = ({
  distance,
  setDistance,
  time,
  setTime,
  pace,
  setPace,
  rpe,
  setRpe,
}) => (
  <div className="flex flex-col">
    <h3>Distance</h3>
    <Input
      type="number"
      placeholder="Distance"
      value={distance || ""}
      onChange={(e) => setDistance(Number(e.target.value))}
    />
    <h3>Workout Time</h3>
    <Input
      type="number"
      placeholder="Time"
      value={time || ""}
      onChange={(e) => setTime(Number(e.target.value))}
    />
    <h3>Pace (optional)</h3>
    <Input
      type="text"
      placeholder="Pace"
      value={pace || ""}
      onChange={(e) => setPace(String(e.target.value))}
    />
    <h3>RPE</h3>
    <Input
      type="number"
      placeholder="RPE"
      value={rpe || ""}
      onChange={(e) => setRpe(Number(e.target.value))}
    />
  </div>
);

export default ErgForm;
