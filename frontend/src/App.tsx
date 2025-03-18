import { useEffect, useState } from "react";
import { getUsers } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center">Lista de Voluntários</h1>
      <ul className="mt-4 bg-white p-4 rounded shadow-md">
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id} className="p-2 border-b">{user.name} - {user.email}</li>
          ))
        ) : (
          <li className="text-center p-4">Nenhum voluntário encontrado.</li>
        )}
      </ul>
    </div>
  );
}

export default App;
