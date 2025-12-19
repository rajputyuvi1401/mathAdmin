import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { deleteUserbyAdmin, getAllUsers } from "../../../api/auth.api.js";
import { useEffect, useState } from "react";

/* ==============================
   Interface
=================================*/
interface User {
  id: number | string;
  username?: string;
  email?: string;
  gender?: string;
  country?: string;
}

/* ==============================
   Constants
=================================*/
const API_URL = "http://43.204.167.118:3000/api/auth/allUser";
const ROWS_PER_PAGE = 10;

/* ==============================
   Component
=================================*/
export default function BasicTableOne() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  /* ==============================
     Fetch Users
  =================================*/
  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Using Axios API method
        const data: unknown = await getAllUsers();
        let list: unknown[] = [];

        if (Array.isArray(data)) list = data;
        else if (data && typeof data === "object") {
          const obj = data as Record<string, unknown>;
          if (Array.isArray(obj.users)) list = obj.users;
          else if (Array.isArray(obj.data)) list = obj.data;
        }

        if (mounted) {
          setUsers(
            list.map((u, idx) => {
              const obj = u as Record<string, unknown>;
              return {
                id: obj.id ?? obj._id ?? idx,
                username: String(obj.username ?? obj.name ?? "").trim(),
                email: String(obj.email ?? ""),
                gender: String(obj.gender ?? ""),
                country: obj.country ? String(obj.country) : "-",
              };
            })
          );
          setCurrentPage(1);
        }
      } catch (err) {
        if (mounted) {
          setError(typeof err === "string" ? err : "Failed to fetch users");
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

  /* ==============================
     Pagination Logic
  =================================*/
  const totalPages = Math.ceil(users.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + ROWS_PER_PAGE);

  const handleDelete = async (userId: string | number) => {
    console.log(userId);
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUserbyAdmin(userId);

      // Update UI
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      alert(typeof err === "string" ? err : "Failed to delete user");
    }
  };

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
                SR No
              </TableCell>

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
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* ==============================
              Table Body
          =============================== */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-5 py-4 text-start text-theme-sm text-gray-500"
                >
                  Loading users...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-5 py-4 text-start text-theme-sm text-error-500"
                >
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-5 py-4 text-start text-theme-sm text-gray-500"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              // paginatedUsers.map((user) => (
              paginatedUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {(currentPage - 1) * ROWS_PER_PAGE + index + 1}
                  </TableCell>
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
                    {user.country}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.id}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete user"
                    >
                      🗑
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ==============================
          Pagination (design unchanged)
      =============================== */}
      {users.length > ROWS_PER_PAGE && (
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="
      rounded-md border px-3 py-1 text-sm disabled:opacity-50
      border-gray-800 text-gray-800
      dark:border-white dark:text-white
    "
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="
      rounded-md border px-3 py-1 text-sm disabled:opacity-50
      border-gray-800 text-gray-800
      dark:border-white dark:text-white
    "
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
