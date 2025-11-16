"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Phone, User, Receipt, Search } from "lucide-react";

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface RegistrationRow {
  id: string;
  registration_id: string;
  full_name: string;
  phone: string;
  adults: number;
  children: number;
  amount_total: number;
  discount_percent?: number;
  payment_method?: string;
  payment_status?: string;
  created_at: string;
}

export default function AdminEventRegistrationsPage() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (adminSession) {
      fetchRegistrations();
    }
  }, [adminSession, filter]);

  const checkAdminAuth = () => {
    try {
      const session = localStorage.getItem("admin_session");
      if (session) {
        const parsed = JSON.parse(session);
        setAdminSession(parsed);
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      let query = supabase
        .from("event_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("payment_status", filter);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching registrations:", error);
        return;
      }
      setRows((data as RegistrationRow[]) || []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    }
  };

  const formatPKR = (amount: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);

  const filteredRows = rows.filter((r) => {
    const t = searchText.trim().toLowerCase();
    if (!t) return true;
    return (
      (r.full_name || "").toLowerCase().includes(t) ||
      (r.phone || "").toLowerCase().includes(t) ||
      (r.registration_id || "").toLowerCase().includes(t)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading admin panel...</div>
      </div>
    );
  }

  if (!adminSession) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar currentPath="/admin/event-registrations" />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Registrations</h1>
            <p className="text-gray-600">View and manage registrations for matchmaking events</p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {[
                { key: "all", label: "All", count: rows.length },
                { key: "paid", label: "Paid", count: rows.filter((r) => r.payment_status === "paid").length },
                { key: "pending", label: "Pending", count: rows.filter((r) => r.payment_status === "pending").length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.key ? "bg-white text-humsafar-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone or ID"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-humsafar-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* List */}
          {filteredRows.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
                <p className="text-gray-600">Try changing filters or search text.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Latest Registrations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead>Adults</TableHead>
                        <TableHead>Children</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRows.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-sm">{r.registration_id}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              {r.full_name}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              {r.phone}
                            </div>
                          </TableCell>
                          <TableCell>{r.adults}</TableCell>
                          <TableCell>{r.children}</TableCell>
                          <TableCell className="whitespace-nowrap">{formatPKR(r.amount_total)}</TableCell>
                          <TableCell>
                            {r.payment_status === "paid" ? (
                              <Badge className="bg-green-100 text-green-800 border-green-300">Paid</Badge>
                            ) : r.payment_status === "pending" ? (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>
                            ) : (
                              <Badge>{r.payment_status || "-"}</Badge>
                            )}
                          </TableCell>
                          <TableCell>{r.payment_method || "-"}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(r.created_at).toLocaleString("en-PK", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-2">
            <Button variant="outline" onClick={fetchRegistrations}>Refresh</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
