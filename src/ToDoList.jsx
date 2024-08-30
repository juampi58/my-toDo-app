import { useState } from 'react';
import './ToDoList.css';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DraggableItem from './components/DraggableItem/DraggableItem';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

const TodoList = () => {
  const [toDoList, setToDoList] = useState([]);
  const [inputText, setInputText] = useState('');
  const [listMode, setListMode] = useState('view');
  const isEditMode = listMode === 'edit';
  const addToDo = (e, text) => {
    e.preventDefault();
    setToDoList([
      ...toDoList,
      { text, completed: false, id: toDoList.length + text },
    ]);
    setInputText('');
    setListMode('view');
  };
  const removeToDo = (id) => {
    setToDoList(toDoList.filter((toDo) => id !== toDo.id));
  };
  const toggleToDo = (id) => {
    setToDoList(
      toDoList.map((toDo) => {
        return toDo.id === id ? { ...toDo, completed: !toDo.completed } : toDo;
      })
    );
  };
  const toggleListMode = () => {
    !isEditMode ? setListMode('edit') : setListMode('view');
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setToDoList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <section>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={toDoList.map((task) => task.id)}>
          <ul>
            {toDoList.map((toDo) => (
              <DraggableItem
                key={toDo.id}
                id={toDo.id}
                isSortableDisabled={!isEditMode}
              >
                <p
                  className="toDo-text"
                  style={{
                    textDecoration: toDo.completed ? 'line-through' : 'none',
                  }}
                  onClick={() => toggleToDo(toDo.id)}
                >
                  {toDo.text}
                </p>
                <XMarkIcon
                  onClick={() => removeToDo(toDo.id)}
                  className={
                    'iconSmall toDo-remove ' + (!isEditMode && ' hidden')
                  }
                />
              </DraggableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>{' '}
      <form onSubmit={(e) => addToDo(e, inputText)}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => handleInputChange(e)}
        />
        <button type="submit">Add</button>
        <button
          onClick={() => toggleListMode()}
          className="editToDoList"
          type="button"
        >
          {isEditMode ? 'View' : 'Edit'}
        </button>
      </form>
    </section>
  );
};

export default TodoList;
