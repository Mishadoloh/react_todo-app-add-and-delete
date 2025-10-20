/* eslint-disable max-len */
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

const USER_ID = 454;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<Status>(Status.ALL);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const isError = Boolean(errorMessage);
  const [loading, setLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  useEffect(() => {
    // eslint-disable-next-line curly
    if (!USER_ID) return;

    async function loadTodos() {
      try {
        const newTodos = await todoService.getTodos();

        setTodos(newTodos);
      } catch {
        setErrorMessage(ErrorMessage.LOAD);
      }
    }

    loadTodos();
  }, []);

  const addTodo = async ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    if (!title.trim()) {
      setErrorMessage(ErrorMessage.EMPTY);

      return;
    }

    const temp: Todo = { id: 0, title: title.trim(), userId, completed };
    setTempTodo(temp);
    setLoading(true);

    try {
      const newTodo = await todoService.createTodo({
        title: temp.title,
        userId,
        completed,
      });

      setTodos(prev => [...prev, newTodo]);
      setTempTodo(null);
    } catch {
      setErrorMessage(ErrorMessage.ADD);
      setTempTodo(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: number) => {
    setLoadingTodoId(ids => [...ids, id]);
    setLoading(true);

    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setLoading(false);
      setLoadingTodoId(ids => ids.filter(todoId => todoId !== id));
    }
  };

  const deleteCompletedTodos = async () => {
    const completed = getCompletedTodos(todos);

    await Promise.allSettled(completed.map(todo => deleteTodo(todo.id)));
  };

  const filteredTodos = useMemo(() => {
    // eslint-disable-next-line curly
    if (status === Status.ACTIVE) return todos.filter(t => !t.completed);
    // eslint-disable-next-line curly
    if (status === Status.COMPLETED) return todos.filter(t => t.completed);

    return todos;
  }, [todos, status]);

  // eslint-disable-next-line curly
  if (!USER_ID) return <UserWarning />;

  return (
    <>
      <section className="section container">
        <p className="title is-4">
          Copy all you need from the prev task:
          <br />
          <a href="https://github.com/mate-academy/react_todo-app-loading-todos#react-todo-app-load-todos">
            React Todo App - Load Todos
          </a>
        </p>
        <p className="subtitle">Styles are already copied</p>
      </section>

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
            isLoading={loading}
            loadingTodoId={loadingTodoId}
            tempTodo={tempTodo}
            onDelete={deleteTodo}
          />

          {todos.length > 0 && (
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
    </>
  );
};
