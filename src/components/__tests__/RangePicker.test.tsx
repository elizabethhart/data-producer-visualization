import { render, screen } from "@testing-library/react";

import RangePicker from "../RangePicker";

describe("RangePicker", () => {
  it("renders the component", () => {
    render(
      <RangePicker
        startTime={new Date()}
        setStartTime={vi.fn()}
        endTime={new Date()}
        setEndTime={vi.fn()}
      />
    );

    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });
});
