import 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';

const DraggableItem = ({ id, children, isSortableDisabled }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : 'none',
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={!isSortableDisabled ? 'task-item' : null}
    >
      <ArrowsUpDownIcon
        className={'drag-handle iconSmall ' + (isSortableDisabled && ' hidden')}
        {...listeners}
        {...attributes}
      >
        <span style={{ cursor: 'grab' }}>Drag</span>
      </ArrowsUpDownIcon>
      {children}
    </li>
  );
};

export default DraggableItem;
