import { Input } from "../ui/input";

type CrossTrainFormProps = {
  crossType: string;
  setCrossType: (value: string) => void;
  time: number;
  setTime: (value: number) => void;
  distance: number;
  setDistance: (value: number) => void;
  rpe: number;
  setRpe: (value: number) => void;
};

const CrossTrainForm: React.FC<CrossTrainFormProps> = ({
  crossType,
  setCrossType,
  time,
  setTime,
  distance,
  setDistance,
  rpe,
  setRpe,
}) => (
  <div className="flex flex-col">
    <h3>Cross Training Type</h3>
    <Input
      type="text"
      placeholder="e.g. Running, Cycling"
      value={crossType || ""}
      onChange={(e) => setCrossType(e.target.value)}
    />
    <h3>Time</h3>
    <Input
      type="number"
      placeholder="Time"
      value={time || ""}
      onChange={(e) => setTime(Number(e.target.value))}
    />
    <h3>Distance</h3>
    <Input
      type="number"
      placeholder="Distance"
      value={distance || ""}
      onChange={(e) => setDistance(Number(e.target.value))}
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

export default CrossTrainForm;
