import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCircle, MessageSquare, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function Dashboard() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [userCountError, setUserCountError] = useState("");
  const [residentCount, setResidentCount] = useState<number | null>(null);
  const [residentCountError, setResidentCountError] = useState("");
  const [activeComplaints, setActiveComplaints] = useState<number | null>(null);
  const [activeComplaintsError, setActiveComplaintsError] = useState("");
  const [buildingCount, setBuildingCount] = useState<number | null>(null);
  const [buildingCountError, setBuildingCountError] = useState("");

  useEffect(() => {
    async function fetchUserCount() {
      try {
        const data = await api.request<{ count: number }>("/api/users/count");
        setUserCount(data.count);
      } catch (err) {
        setUserCountError("Failed to fetch user count");
      }
    }
    fetchUserCount();
  }, []);

  useEffect(() => {
    async function fetchResidentCount() {
      try {
        const data = await api.request<{ count: number }>(
          "/api/residents/count"
        );
        setResidentCount(data.count);
      } catch (err) {
        setResidentCountError("Failed to fetch resident count");
      }
    }
    fetchResidentCount();
  }, []);

  useEffect(() => {
    async function fetchActiveComplaints() {
      try {
        const data = await api.request<{ count: number }>(
          "/api/complaints/active"
        );
        setActiveComplaints(data.count);
      } catch (err) {
        setActiveComplaintsError("Failed to fetch active complaints");
      }
    }
    fetchActiveComplaints();
  }, []);

  useEffect(() => {
    async function fetchBuildingCount() {
      try {
        const data = await api.request<{ count: number }>(
          "/api/buildings/count"
        );
        setBuildingCount(data.count);
      } catch (err) {
        setBuildingCountError("Failed to fetch building count");
      }
    }
    fetchBuildingCount();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userCountError ? "-" : userCount !== null ? userCount : "..."}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Residents
            </CardTitle>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {residentCountError
                ? "-"
                : residentCount !== null
                ? residentCount
                : "..."}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Complaints
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeComplaintsError
                ? "-"
                : activeComplaints !== null
                ? activeComplaints
                : "..."}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New complaint submitted
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Building A - Unit 101
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {i} hour{i !== 1 ? "s" : ""} ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link
                to="/users"
                className="w-full block rounded-lg border p-4 text-left hover:bg-accent"
              >
                <div className="font-medium">Add New User</div>
                <div className="text-sm text-muted-foreground">
                  Create a new user account
                </div>
              </Link>
              <Link
                to="/residents"
                className="w-full block rounded-lg border p-4 text-left hover:bg-accent"
              >
                <div className="font-medium">Register Resident</div>
                <div className="text-sm text-muted-foreground">
                  Add a new resident to the system
                </div>
              </Link>
              <Link
                to="/complaints"
                className="w-full block rounded-lg border p-4 text-left hover:bg-accent"
              >
                <div className="font-medium">View Reports</div>
                <div className="text-sm text-muted-foreground">
                  Access system reports and analytics
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
