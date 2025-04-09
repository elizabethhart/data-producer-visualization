import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

function ProducerSelection({
  producers,
  selectedProducers,
  setSelectedProducers,
}: {
  producers: number[];
  selectedProducers: number[];
  setSelectedProducers: (producers: number[]) => void;
}) {
  const handleChange = (producer: number, checked: boolean) => {
    if (checked) {
      setSelectedProducers([...selectedProducers, producer]);
    } else {
      setSelectedProducers(selectedProducers.filter((p) => p !== producer));
    }
  };

  return (
    <div>
      <label>Select Producers</label>
      <FormGroup>
        {producers.map((producer) => (
          <FormControlLabel
            key={producer}
            control={
              <Checkbox
                checked={selectedProducers.includes(producer)}
                onChange={(e) => handleChange(producer, e.target.checked)}
                name={producer.toString()}
              />
            }
            label={`Producer ${producer}`}
          />
        ))}
      </FormGroup>
    </div>
  );
}

export default ProducerSelection;
