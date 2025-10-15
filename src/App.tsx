/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todoApi';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErorrMessage';
import { TodoHeader } from './components/TodoHeader';
import { getCompletedTodos } from './services/todoUtils';

const USER_ID = 11011;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const isError = Boolean(errorMessage);

  // === Load all todos ===
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await todoService.getTodos(USER_ID);

        setTodos(loadedTodos);
      } catch {
        setErrorMessage(ErrorMessage.LOAD);
      }
    };

    loadTodos();
  }, []);

  // === Add a todo ===
  const addTodo = async ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.TITLE);
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    const temp: Todo = { id: 0, title: trimmedTitle, userId, completed };

    setTempTodo(temp);
    setLoading(true);

    try {
      const createdTodo = await todoService.createTodo({
        title: trimmedTitle,
        userId,
        completed,
      });

      setTodos(prev => [...prev, createdTodo]);
    } catch {
      setErrorMessage(ErrorMessage.ADD);
    } finally {
      setTempTodo(null);
      setLoading(false);
    }
  };

  // === Delete a todo ===
  const deleteTodo = async (todoId: number) => {
    setProcessingIds(prev => [...prev, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  // === Delete all completed todos ===
  const deleteCompletedTodos = async () => {
    const completedTodos = getCompletedTodos(todos);

    await Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)));
  };

  // === Filtered list ===
  const filteredTodos = useMemo(() => {
    switch (status) {
      case Status.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Status.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, status]);

  // === User check ===
  if (!USER_ID) {
    return <UserWarning />;
  }

  // === Render ===
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          loading={loading}
          isError={isError}
          onAdd={addTodo}
          onError={setErrorMessage}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          processingIds={processingIds}
          onDelete={deleteTodo}
        />

        {!!todos.length && (
          <TodoFooter
            todos={todos}
            status={status}
            onStatusChange={setStatus}
            onClearCompleted={deleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClearMessage={() => setErrorMessage('')}
      />
    </div>
  );
};
