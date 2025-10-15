import { Todo } from '../types/Todo';
// eslint-disable-next-line import/extensions
import { client } from '../utils/fetchClient';

export const USER_ID = '3455';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({ title, userId, completed}: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed});
};
