"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface PaymentRow {
  user_id: string;
  amount: number | null;
  package_type: string | null;
  payment_status: string;
  created_at: string;
}

interface UserAggregate {
  user_id: string;
  user_name?: string;
  total_amount: number;
  latest_package: string;
  payments_count: number;
  last_payment_date: string;
  latest_status: string;
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "paid">("paid");
  const [searchText, setSearchText] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const toggleExpanded = (userId: string) => {
    setExpandedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId); else next.add(userId);
      return next;
    });
  };

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const session = localStorage.getItem("admin_session");
        if (session) {
          const parsedSession = JSON.parse(session);
          setAdminSession(parsedSession);
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Error checking admin auth:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [router]);

  useEffect(() => {
    if (!adminSession) return;

    const fetchPayments = async () => {
      try {
        const { data, error } = await supabase
          .from("payments")
          .select("user_id, amount, package_type, payment_status, created_at")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching payments:", error);
          return;
        }
        const rows: PaymentRow[] = (data || []).map((p: any) => ({
          user_id: p.user_id,
          amount: p.amount ?? null,
          package_type: p.package_type ?? null,
          payment_status: p.payment_status,
          created_at: p.created_at,
        }));
        setPayments(rows);

        // Fetch user names for distinct user_ids
        const userIds = Array.from(new Set(rows.map(r => r.user_id))).filter(Boolean);
        if (userIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from("user_profiles")
            .select("user_id, first_name, last_name")
            .in("user_id", userIds);

          if (profilesError) {
            console.error("Error fetching user profiles:", profilesError);
          } else if (profiles && profiles.length > 0) {
            const nameMap: Record<string, string> = {};
            for (const p of profiles as any[]) {
              const full = `${p.first_name || ""} ${p.last_name || ""}`.trim();
              nameMap[p.user_id] = full || "—";
            }
            setUserNames(nameMap);
          }
        }
      } catch (err) {
        console.error("Unexpected error while fetching payments:", err);
      }
    };

    fetchPayments();
  }, [adminSession]);

  const paidStatuses = new Set(["accepted", "completed"]);

  const aggregates: UserAggregate[] = useMemo(() => {
    const byUser = new Map<string, PaymentRow[]>();
    const rows = filter === "paid" ? payments.filter(p => paidStatuses.has(p.payment_status)) : payments;
    for (const p of rows) {
      const list = byUser.get(p.user_id) || [];
      list.push(p);
      byUser.set(p.user_id, list);
    }
    const result: UserAggregate[] = [];
    byUser.forEach((list, user_id) => {
      // sort latest first
      const sorted = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const latest = sorted[0];
      const total = sorted.reduce((sum, r) => sum + Number(r.amount ?? 0), 0);
      result.push({
        user_id,
        user_name: userNames[user_id] || "—",
        total_amount: total,
        latest_package: String(latest.package_type || "-").toLowerCase(),
        payments_count: sorted.length,
        last_payment_date: latest.created_at,
        latest_status: latest.payment_status,
      });
    });
    // sort by total amount desc
    return result.sort((a, b) => b.total_amount - a.total_amount);
  }, [payments, filter, userNames]);

  const totals = useMemo(() => {
    const paid = payments.filter(p => paidStatuses.has(p.payment_status));
    const distinctUsers = new Set(paid.map(p => p.user_id));
    const totalAmount = paid.reduce((sum, r) => sum + Number(r.amount ?? 0), 0);
    const packageCounts: Record<string, number> = {};
    for (const p of paid) {
      const key = String(p.package_type || "-").toLowerCase();
      packageCounts[key] = (packageCounts[key] || 0) + 1;
    }
    return {
      paidUsers: distinctUsers.size,
      totalAmount,
      packageCounts,
    };
  }, [payments]);

  const filteredAggregates = useMemo(() => {
    if (!searchText) return aggregates;
    const q = searchText.toLowerCase();
    return aggregates.filter(a =>
      (a.user_name || "").toLowerCase().includes(q)
      || a.user_id.toLowerCase().includes(q)
    );
  }, [aggregates, searchText]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!adminSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar currentPath="/admin/payments" />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-humsafar-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-humsafar-500">Payments</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Badge className="bg-green-100 text-green-800 border-green-300">Paid Users: {totals.paidUsers}</Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">Total Paid: ₨ {totals.totalAmount.toLocaleString()}</Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white border-0">
              <CardHeader>
                <CardTitle className="text-gray-800">Paid Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-humsafar-500">{totals.paidUsers}</div>
                <p className="text-xs text-gray-500">Distinct users with accepted/completed payments</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0">
              <CardHeader>
                <CardTitle className="text-gray-800">Total Amount Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-humsafar-500">₨ {totals.totalAmount.toLocaleString()}</div>
                <p className="text-xs text-gray-500">Sum of accepted/completed payments</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0">
              <CardHeader>
                <CardTitle className="text-gray-800">Packages Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(totals.packageCounts).map(([pkg, count]) => (
                    <Badge key={pkg} className="bg-gray-100 text-gray-800 border-gray-300">
                      {pkg}: {count}
                    </Badge>
                  ))}
                  {Object.keys(totals.packageCounts).length === 0 && (
                    <span className="text-sm text-gray-500">No paid packages yet</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {[
                { key: "paid", label: "Paid" },
                { key: "all", label: "All" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.key ? "bg-white text-humsafar-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-64">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Total Paid (₨)</TableHead>
                  <TableHead>Latest Package</TableHead>
                  <TableHead>Payments</TableHead>
                  <TableHead>Last Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAggregates.map((row) => (
                  <>
                  <TableRow key={row.user_id}>
                    <TableCell className="text-sm">{row.user_name || "—"}</TableCell>
                    <TableCell className="text-right font-semibold">{row.total_amount.toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{row.latest_package}</TableCell>
                    <TableCell>{row.payments_count}</TableCell>
                    <TableCell>{new Date(row.last_payment_date).toLocaleString()}</TableCell>
                    <TableCell>
                      {paidStatuses.has(row.latest_status) ? (
                        <Badge className="bg-green-100 text-green-800 border-green-300">Paid</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">{row.latest_status}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleExpanded(row.user_id)}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm hover:bg-gray-50"
                        aria-expanded={expandedUsers.has(row.user_id)}
                        aria-controls={`payments-details-${row.user_id}`}
                      >
                        {expandedUsers.has(row.user_id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span>Show payments</span>
                      </button>
                    </TableCell>
                  </TableRow>
                  {expandedUsers.has(row.user_id) && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50 p-0" id={`payments-details-${row.user_id}`}>
                        <div className="px-4 py-3">
                          <div className="text-sm text-gray-600 mb-2">Individual payments</div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Amount (₨)</TableHead>
                                <TableHead>Package</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(
                                (filter === "paid"
                                  ? payments.filter(p => paidStatuses.has(p.payment_status))
                                  : payments
                                ).filter(p => p.user_id === row.user_id)
                              ).map((p, idx) => (
                                <TableRow key={`${row.user_id}-${idx}`}>
                                  <TableCell className="text-right">{Number(p.amount ?? 0).toLocaleString()}</TableCell>
                                  <TableCell className="capitalize">{String(p.package_type || "-").toLowerCase()}</TableCell>
                                  <TableCell>
                                    {paidStatuses.has(p.payment_status) ? (
                                      <Badge className="bg-green-100 text-green-800 border-green-300">Paid</Badge>
                                    ) : (
                                      <Badge className="bg-gray-100 text-gray-800 border-gray-300">{p.payment_status}</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>{new Date(p.created_at).toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                              {(
                                (filter === "paid"
                                  ? payments.filter(p => paidStatuses.has(p.payment_status))
                                  : payments
                                ).filter(p => p.user_id === row.user_id)
                              ).length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center text-gray-500 py-6">No payments</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  </>
                ))}
                {filteredAggregates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
