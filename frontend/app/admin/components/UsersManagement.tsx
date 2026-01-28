"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserX,
  UserCheck,
  Key,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import * as api from "@/lib/api";

export default function UsersManagement() {
  const { lang } = useI18n();
  const [users, setUsers] = useState<api.AdminUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const limit = 20;

  const t = {
    pl: {
      title: "Zarządzanie Użytkownikami",
      search: "Szukaj po email lub nazwie...",
      loading: "Ładowanie...",
      noUsers: "Nie znaleziono użytkowników",
      email: "Email",
      nickname: "Pseudonim",
      role: "Rola",
      status: "Status",
      actions: "Akcje",
      createdAt: "Utworzono",
      active: "Aktywny",
      banned: "Zbanowany",
      admin: "Admin",
      user: "Użytkownik",
      ban: "Zbanuj",
      unban: "Odbanuj",
      resetPassword: "Resetuj hasło",
      confirmBan: "Czy na pewno chcesz zbanować tego użytkownika?",
      confirmUnban: "Czy na pewno chcesz odbanować tego użytkownika?",
      confirmReset: "Czy na pewno chcesz zresetować hasło tego użytkownika?",
      banSuccess: "Użytkownik został zbanowany",
      unbanSuccess: "Użytkownik został odbanowany",
      resetSuccess: "Wysłano email z linkiem do resetowania hasła",
      error: "Wystąpił błąd",
      totalUsers: "Łącznie użytkowników",
      page: "Strona",
      of: "z",
    },
    en: {
      title: "Users Management",
      search: "Search by email or nickname...",
      loading: "Loading...",
      noUsers: "No users found",
      email: "Email",
      nickname: "Nickname",
      role: "Role",
      status: "Status",
      actions: "Actions",
      createdAt: "Created",
      active: "Active",
      banned: "Banned",
      admin: "Admin",
      user: "User",
      ban: "Ban",
      unban: "Unban",
      resetPassword: "Reset Password",
      confirmBan: "Are you sure you want to ban this user?",
      confirmUnban: "Are you sure you want to unban this user?",
      confirmReset: "Are you sure you want to reset this user's password?",
      banSuccess: "User has been banned",
      unbanSuccess: "User has been unbanned",
      resetSuccess: "Password reset email sent",
      error: "An error occurred",
      totalUsers: "Total users",
      page: "Page",
      of: "of",
    },
  }[lang];

  useEffect(() => {
    console.log('useEffect triggered, calling fetchUsers');
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    console.log('fetchUsers called');
    try {
      setLoading(true);
      console.log('Calling adminGetAllUsers...');
      const response = await api.adminGetAllUsers(currentPage, limit);
      console.log('Admin API response:', response);
      console.log('Users data:', response.users);
      console.log('Total:', response.total);
      setUsers(response.users || []);
      setTotal(response.total);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(t.error);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!confirm(t.confirmBan)) return;

    try {
      setActionLoading(userId);
      await api.adminBanUser(userId);
      alert(t.banSuccess);
      await fetchUsers();
    } catch (error) {
      console.error("Error banning user:", error);
      alert(t.error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (!confirm(t.confirmUnban)) return;

    try {
      setActionLoading(userId);
      await api.adminUnbanUser(userId);
      alert(t.unbanSuccess);
      await fetchUsers();
    } catch (error) {
      console.error("Error unbanning user:", error);
      alert(t.error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!confirm(t.confirmReset)) return;

    try {
      setActionLoading(userId);
      await api.adminResetUserPassword(userId);
      alert(t.resetSuccess);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert(t.error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = (users || []).filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('Users state:', users);
  console.log('Filtered users:', filteredUsers);
  console.log('Loading:', loading);

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            {t.totalUsers}: {total}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">{loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">{t.noUsers}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t.email}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t.nickname}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t.role}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t.createdAt}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {user.nickname}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <Shield className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          {user.role === "admin" ? t.admin : t.user}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {user.isActive ? (
                            <UserCheck className="w-3 h-3" />
                          ) : (
                            <UserX className="w-3 h-3" />
                          )}
                          {user.isActive ? t.active : t.banned}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBanUser(user.id)}
                              disabled={
                                actionLoading === user.id ||
                                user.role === "admin"
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              {t.ban}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnbanUser(user.id)}
                              disabled={actionLoading === user.id}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              {t.unban}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResetPassword(user.id)}
                            disabled={actionLoading === user.id}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            <Key className="w-4 h-4 mr-1" />
                            {t.resetPassword}
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.page} {currentPage} {t.of} {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
