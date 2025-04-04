import React from 'react';
import { render, screen } from '@testing-library/react';
import Notification from '../../components/common/Notification';

describe('Notification Component', () => {
  test('renders success notification correctly', () => {
    render(
      <Notification
        type="success"
        message="Operação realizada com sucesso!"
        isVisible={true}
        onClose={() => {}}
      />
    );
    
    expect(screen.getByText('Operação realizada com sucesso!')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-green-50');
  });

  test('renders error notification correctly', () => {
    render(
      <Notification
        type="error"
        message="Ocorreu um erro!"
        isVisible={true}
        onClose={() => {}}
      />
    );
    
    expect(screen.getByText('Ocorreu um erro!')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50');
  });

  test('does not render when not visible', () => {
    const { container } = render(
      <Notification
        type="success"
        message="Operação realizada com sucesso!"
        isVisible={false}
        onClose={() => {}}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });
});
