import { render, screen } from '@testing-library/react';

function DummyComponent() {
  return <h1>Support Desk Testing</h1>;
}

describe('Frontend Setup Test', () => {
  it('renders heading correctly', () => {
    render(<DummyComponent />);
    expect(screen.getByText('Support Desk Testing')).toBeInTheDocument();
  });
});