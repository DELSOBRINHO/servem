import React, { ReactNode } from 'react';
import { Transition } from '@headlessui/react';

interface AnimatedListProps {
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  keyExtractor: (item: any) => string;
  className?: string;
  emptyMessage?: string;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  renderItem,
  keyExtractor,
  className = '',
  emptyMessage = 'Nenhum item encontrado'
}) => {
  return (
    <div className={className}>
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {items.map((item, index) => (
            <Transition
              key={keyExtractor(item)}
              show={true}
              appear={true}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
              className="transition-all duration-200"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {renderItem(item, index)}
            </Transition>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnimatedList;
