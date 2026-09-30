import { fireEvent, render, screen } from "@testing-library/react";
import { AppCombobox } from "../../../src/components/inputs/AppCombobox";
import { AppDialog } from "../../../src/components/containers/AppDialog";
import { PromptTextArea } from "../../../src/components/ui/PromptTextArea";

describe("PromptTextArea", () => {
  it("trims and submits on Enter, then clears the prompt", () => {
    const onSubmit = jest.fn();
    render(<PromptTextArea isMobile={false} disabled={false} onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText("Ask me anything");

    fireEvent.change(textarea, { target: { value: "  explain this  " } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(onSubmit).toHaveBeenCalledWith("explain this");
    expect(textarea).toHaveValue("");
  });

  it("does not submit blank or disabled prompts", () => {
    const onSubmit = jest.fn();
    const { rerender } = render(<PromptTextArea isMobile={false} disabled={false} onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText("Ask me anything");

    fireEvent.change(textarea, { target: { value: "   " } });
    fireEvent.keyDown(textarea, { key: "Enter" });
    rerender(<PromptTextArea isMobile={false} disabled onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText("Ask me anything"), { target: { value: "send me" } });
    fireEvent.keyDown(screen.getByPlaceholderText("Ask me anything"), { key: "Enter" });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits on mobile using the submit button rather than Enter", () => {
    const onSubmit = jest.fn();
    render(<PromptTextArea isMobile disabled={false} onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText("Ask me anything");

    fireEvent.change(textarea, { target: { value: "mobile prompt" } });
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith("mobile prompt");
  });
});

describe("AppDialog", () => {
  it("renders only while open and closes on Escape", () => {
    const onClose = jest.fn();
    const { rerender } = render(<AppDialog open={false} onClose={onClose}>Content</AppDialog>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(<AppDialog open onClose={onClose}>Content</AppDialog>);
    expect(screen.getByRole("dialog")).toHaveTextContent("Content");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("AppCombobox", () => {
  it("selects enabled options and ignores disabled options", () => {
    const onValueChange = jest.fn();
    render(
      <AppCombobox
        aria-label="Model"
        value="first"
        options={[
          { label: "First model", value: "first" },
          { label: "Second model", value: "second" },
          { label: "Unavailable", value: "unavailable", disabled: true },
        ]}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Model" }));
    fireEvent.click(screen.getByRole("option", { name: "Unavailable" }));
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("option", { name: "Second model" }));
    expect(onValueChange).toHaveBeenCalledWith("second");
  });
});
