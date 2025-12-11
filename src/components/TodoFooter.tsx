import React from 'react';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

interface TodoFooterProps {
  todos: Todo[];
  status: Status;
  onStatusChange: (status: Status) => void;
  onClearCompleted: (isPressed: boolean) => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  status,
  onStatusChange,
  onClearCompleted,
}) => {
  const remainingTodos = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {remainingTodos} items left
      </span>

      <ul className="filters">
        <li>
          <a
            href="#/"
            className={status === Status.All ? 'selected' : ''}
            onClick={() => onStatusChange(Status.All)}
            data-cy="FilterAll"
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={status === Status.ACTIVE ? 'selected' : ''}
            onClick={() => onStatusChange(Status.ACTIVE)}
            data-cy="FilterActive"
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={status === Status.COMPLETED ? 'selected' : ''}
            onClick={() => onStatusChange(Status.COMPLETED)}
            data-cy="FilterCompleted"
          >
            Completed
          </a>
        </li>
      </ul>

      {hasCompletedTodos && (
        <button
          className="clear-completed"
          onClick={() => onClearCompleted(true)}
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
