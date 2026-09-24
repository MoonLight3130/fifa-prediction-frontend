import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.ts';

export interface Todo {
  id: string | number;
  name?: string;
  title?: string;
  [key: string]: unknown;
}

export default function SupabaseTodos() {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodos() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('todos').select();
        if (error) throw error;
        setTodos(data as Todo[]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch todos');
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, []);

  if (loading) return <div className="p-4 text-sm text-gray-400">Loading todos from Supabase...</div>;
  if (error) return <div className="p-4 text-sm text-red-400">Supabase query: {error}</div>;

  return (
    <ul className="space-y-2 p-4">
      {todos && todos.length > 0 ? (
        todos.map((todo) => (
          <li key={todo.id} className="text-sm">
            {todo.name || todo.title || JSON.stringify(todo)}
          </li>
        ))
      ) : (
        <li className="text-sm text-gray-500">No todos found in Supabase table "todos".</li>
      )}
    </ul>
  );
}
