import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type Props = {
  todos: Todo[];
  status: Status;
  onStatusChange: (newStatus: Status) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  status,
  onStatusChange,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onStatusChange(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onStatusChange(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onStatusChange(Status.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {completedCount > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
