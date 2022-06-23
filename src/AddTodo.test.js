import { render, screen, fireEvent } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import App from "./App";

let container = null;
beforeEach(() => {
	// setup a DOM element as a render target
	container = document.createElement("div");
	document.body.appendChild(container);
});

afterEach(() => {
	// cleanup on exiting
	unmountComponentAtNode(container);
	container.remove();
	container = null;
});

test("test that App component doesn't render dupicate Task", () => {
	render(<App />);
	const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
	const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
	const element = screen.getByRole("button", { name: /Add/i });
	const task = "Finish Homework";
	const dueDate = "08/01/2022";
	fireEvent.change(inputTask, { target: { value: task } });
	fireEvent.change(inputDate, { target: { value: dueDate } });
	fireEvent.click(element);
	fireEvent.change(inputTask, { target: { value: task } });
	fireEvent.change(inputDate, { target: { value: dueDate } });
	fireEvent.click(element);
	const check = screen.getAllByText(/Finish Homework/i);
	expect(check.length).toBe(1);
});

test("test that App component doesn't add a task without task name", () => {
	render(<App />);
	const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
	const element = screen.getByRole("button", { name: /Add/i });
	const dueDate = "08/01/2022";
	fireEvent.change(inputDate, { target: { value: dueDate } });
	fireEvent.click(element);
	const check = screen.getByText(/You have no todo's left/i);
	expect(check).toBeInTheDocument();
});

test("test that App component doesn't add a task without due date", () => {
	render(<App />);
	const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
	const element = screen.getByRole("button", { name: /Add/i });
	const task = "Go for a Walk";
	fireEvent.change(inputTask, { target: { value: task } });
	fireEvent.click(element);
	const check = screen.getByText(/You have no todo's left/i);
	expect(check).toBeInTheDocument();
});

test("test that App component can be deleted thru checkbox", () => {
	render(<App />);
	const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
	const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
	const element = screen.getByRole("button", { name: /Add/i });
	const task = "Shop for Gifts";
	const dueDate = "07/21/2022";
	fireEvent.change(inputTask, { target: { value: task } });
	fireEvent.change(inputDate, { target: { value: dueDate } });
	fireEvent.click(element);
	const checkbox = screen.getByRole("checkbox");
	fireEvent.click(checkbox);
	const check = screen.getByText(/You have no todo's left/i);
	expect(check).toBeInTheDocument();
});

test("test that App component renders different colors for past due events", () => {
	render(<App />);
	const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
	const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
	const element = screen.getByRole("button", { name: /Add/i });
	const task = "Study for Test";
	const dueDate = "01/01/1999";
	fireEvent.change(inputTask, { target: { value: task } });
	fireEvent.change(inputDate, { target: { value: dueDate } });
	fireEvent.click(element);
	const taskColor = screen.getByTestId(/Study for Test/i).style.background;
	expect(taskColor).toBe("red");
});
