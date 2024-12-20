import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrainerOverviewTable from '../../components/trainer/trainerOverviewTable';
import { Trainer } from '@types';

// Mock Trainer data
const mockTrainers: Trainer[] = [
  {
    id: 1,
    user: {
      firstName: 'Ash',
      lastName: 'Ketchum',
      role: 'admin',
      email: 'ash@gmail.com',
      password: 'password'
    },
    pokemon: [],
    badges: []
  },
  {
    id: 2,
    user: {
      firstName: 'Misty',
      lastName: 'Waterflower',
      role: 'admin',
      email: 'misty@gmail.com',
      password: 'password'
    },
    pokemon: [],
    badges: []
  },
];

// Mock selectTrainer function
const mockSelectTrainer = jest.fn();

describe('TrainerOverviewTable', () => {
  test('renders trainer information correctly', () => {
    render(<TrainerOverviewTable trainers={mockTrainers} selectTrainer={mockSelectTrainer} />);

    // Check if the first name and last name are rendered in the table
    expect(screen.getByText(/Ash/)).toBeInTheDocument();
    expect(screen.getByText(/Ketchum/)).toBeInTheDocument();
    expect(screen.getByText(/Misty/)).toBeInTheDocument();
    expect(screen.getByText(/Waterflower/)).toBeInTheDocument();
  });

  test('calls selectTrainer with correct trainer when a row is clicked', () => {
    render(<TrainerOverviewTable trainers={mockTrainers} selectTrainer={mockSelectTrainer} />);

    // Simulate clicking on the first row (Ash Ketchum)
    fireEvent.click(screen.getByText(/Ash/));

    // Check if selectTrainer was called with the correct trainer
    expect(mockSelectTrainer).toHaveBeenCalledWith(mockTrainers[0]);

    // Simulate clicking on the second row (Misty Waterflower)
    fireEvent.click(screen.getByText(/Misty/));

    // Check if selectTrainer was called with the second trainer
    expect(mockSelectTrainer).toHaveBeenCalledWith(mockTrainers[1]);
  });

  test('has role button on each row', () => {
    render(<TrainerOverviewTable trainers={mockTrainers} selectTrainer={mockSelectTrainer} />);

    // Check if each row has role="button"
    const rows = screen.getAllByRole('button');
    expect(rows.length).toBe(mockTrainers.length); // Ensure the number of rows matches the number of trainers
  });
});
