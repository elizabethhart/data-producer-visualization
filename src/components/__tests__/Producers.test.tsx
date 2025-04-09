import { render, screen } from "@testing-library/react";

import Producers from "../Producers";

describe("Producers", () => {
  it("renders the component", () => {
    render(<Producers producers={[]} />);

    screen.getByText("Data Producers");
  });
});
