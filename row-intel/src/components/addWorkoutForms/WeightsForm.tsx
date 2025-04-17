import { Input } from "../ui/input";

type WeightsFormProps = {
  setsReps: string;
  setSetsReps: (value: string) => void;
};

const WeightsForm: React.FC<WeightsFormProps> = ({ setsReps, setSetsReps }) => (
  <div className="flex flex-col">
    <h3>Sets & Reps</h3>
    <Input
      type="text"
      placeholder="e.g. 3x10 Squats"
      value={setsReps}
      onChange={(e) => setSetsReps(e.target.value)}
    />
  </div>
);

export default WeightsForm;
