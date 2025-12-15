import {Table, TableBody,TableCell,TableHeader, TableRow,} from "../../ui/table";

import { useEffect, useState } from "react";

/* ==============================
   Interface
=================================*/
interface User {
  id: number | string;
  username?: string;
  name?: string;
  email?: string;
  gender?: string;
  country?: string;
}

/* ==============================
   Component state (will fetch from API)
=================================*/
const API_URL = "http://43.204.167.118:3000/api/auth/allUser";

/* ==============================
   Component
=================================*/
export default function BasicTableOne() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: unknown = await res.json();

        // handle different response shapes safely (avoid `any`)
        let list: unknown[] = [];
        if (Array.isArray(data)) list = data as unknown[];
        else if (data && typeof data === "object") {
          const obj = data as Record<string, unknown>;
          const usersProp = obj["users"];
          const dataProp = obj["data"];
          if (Array.isArray(usersProp)) list = usersProp as unknown[];
          else if (Array.isArray(dataProp)) list = dataProp as unknown[];
          else {
            const arr = Object.values(obj).find((v) => Array.isArray(v));
            if (Array.isArray(arr)) list = arr as unknown[];
          }
        }

        if (mounted) {
          setUsers(
            list.map((u: unknown, idx: number) => {
              const obj = u as Record<string, unknown>;
              const idVal = obj["id"] ?? obj["_id"] ?? idx;
              const usernameVal = obj["username"] ?? obj["name"] ?? `${String(obj["firstName"] ?? "")} ${String(obj["lastName"] ?? "")}`;
              return {
                id: idVal,
                username: usernameVal ? String(usernameVal).trim() : "",
                email: obj["email"] ? String(obj["email"]) : "",
                gender: obj["gender"] ? String(obj["gender"]) : "",
                country: obj["country"] ? String(obj["country"]) : undefined,
              } as User;
            })
          );
        }
      } catch (err: unknown) {
        if (mounted) {
          if (err instanceof Error) setError(err.message || "Failed to fetch users");
          else setError(String(err) || "Failed to fetch users");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>

          {/* ==============================
              Table Header
          =============================== */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Username
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Gender
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Country
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                ID
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* ==============================
              Table Body
          =============================== */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500" colSpan={5}>
                  Loading users...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-error-500" colSpan={5}>
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500" colSpan={5}>
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {user.username}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.gender}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.country ?? "-"}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.id}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </div>
    </div>
  );
}
