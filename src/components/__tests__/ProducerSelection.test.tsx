import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProducerSelection from "../ProducerSelection";

const mocks = vi.hoisted(() => ({
  setSelectedProducers: vi.fn(),
}));

describe("ProducerSelection", async () => {
  it("renders the component", () => {
    render(
      <ProducerSelection
        producers={[]}
        selectedProducers={[]}
        setSelectedProducers={vi.fn()}
      />
    );

    screen.getByText("Select Producers");
  });

  it("allows selection of producers", async () => {
    const user = userEvent.setup();
    render(
      <ProducerSelection
        producers={[1, 2, 3]}
        selectedProducers={[]}
        setSelectedProducers={mocks.setSelectedProducers}
      />
    );

    await user.click(screen.getByLabelText("Producer 1"));

    expect(mocks.setSelectedProducers).toHaveBeenCalledWith([1]);
  });

  it("allows de-selection of producers", async () => {
    const user = userEvent.setup();
    render(
      <ProducerSelection
        producers={[1, 2, 3]}
        selectedProducers={[1, 2, 3]}
        setSelectedProducers={mocks.setSelectedProducers}
      />
    );

    await user.click(screen.getByLabelText("Producer 1"));

    expect(mocks.setSelectedProducers).toHaveBeenCalledWith([2, 3]);
  });
});
