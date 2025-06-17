import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCircle, MessageSquare, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation()
  const [userCount, setUserCount] = useState<number | null>(null);
  const [userCountError, setUserCountError] = useState("");
  const [residentCount, setResidentCount] = useState<number | null>(null);
  const [residentCountError, setResidentCountError] = useState("");
  const [activeComplaints, setActiveComplaints] = useState<number | null>(null);
  const [activeComplaintsError, setActiveComplaintsError] = useState("");
  const [buildingCount, setBuildingCount] = useState<number | null>(null);
  const [buildingCountError, setBuildingCountError] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesError, setActivitiesError] = useState("");

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

  useEffect(() => {
    async function fetchActivities() {
      try {
        const data = await api.request<any[]>("/api/activity");
        setActivities(data);
      } catch (err) {
        setActivitiesError("Failed to fetch activities");
      }
    }
    fetchActivities();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalUsers')}</CardTitle>
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
              {t('dashboard.totalResidents')}
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
              {t('dashboard.activeComplaints')}
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
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activitiesError ? (
                <div className="text-destructive">{activitiesError}</div>
              ) : activities.length === 0 ? (
                <div className="text-muted-foreground">No recent activity.</div>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.user?.name || activity.user?.email || 'Unknown user'}
                        {": "}
                        <span className="font-normal">{activity.action} {activity.entity}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.details}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(activity.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link
                to="/users"
                className="w-full block rounded-lg border p-4 text-left hover:bg-accent"
              >
                <div className="font-medium">{t('dashboard.addNewUser')}</div>
                <div className="text-sm text-muted-foreground">
                  {t('dashboard.createUserAccount')}
                </div>
              </Link>
              <Link
                to="/residents"
                className="w-full block rounded-lg border p-4 text-left hover:bg-accent"
              >
                <div className="font-medium">{t('dashboard.registerResident')}</div>
                <div className="text-sm text-muted-foreground">
                  {t('dashboard.addNewResident')}
                </div>
              </Link>
              <Link
                to="/complaints"
                className="w-full block rounded-lg border p-4 text-left hover:bg-accent"
              >
                <div className="font-medium">{t('dashboard.viewReports')}</div>
                <div className="text-sm text-muted-foreground">
                  {t('dashboard.accessReports')}
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
