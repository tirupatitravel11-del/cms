"use Client"
import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Shield, TrendingUp, Bell, Settings, LogOut, Currency } from 'lucide-react';
import axios from 'axios';

interface DashboardProps {
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [stats, setStats] = useState<any>([])

  const getStats = async () => {
    try {
      const result = await axios.post(process.env.apiUrl + `/api/get-dashboard-stats`, {}, { withCredentials: true })
  //      const statsArray = Object.entries(result.data).map(([key, value]) => ({
  //   key,
  //   value
  // }));
        setStats(result?.data?.stats)


    } catch (error) {

    }
  }

  useEffect(() => {
    getStats()
  }, [])

 

  // const backgroundColor: any = {
  //   totalStudents: "from-purple-500 to-purple-600",
  //   totalemployee: "from-orange-500 to-orange-600",
  //   totalCourse: "from-green-500 to-green-600"
  // };
  const statistics = [
    {
      title: "Total Students",
      value: stats?.totalStudents,
      change: "+12%",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      background: "#5554ab"
    },
    {
      title: "Total Employees",
      value: stats?.totalEmployees,
      change: "+2.1%",
      icon: <Shield className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      background: "#6b70fb"

    },
    {
      title: "Courses",
      value: stats?.totalCourse,
      change: "+8%",
      icon: <Currency className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      background: "#f66874"

    },
    {
      title: "Total Leads",
      value: stats?.totalLeads,
      change: "+0.1%",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
      background: "#d644c5"

    }
  ];



  return (
    <div className="min-h-screen bg-gray-50 flex-1">
      {/* Header */}
    
      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statistics.map((stat, index) => (
            <div key={index} style={{ backgroundColor: stat.background }} className={`rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}>

              <p className="text-white text-xl font-bold">{stat.title}</p>
              <div className="flex items-center justify-between my-2">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                  {stat.icon}
                </div> */}
                {/* {/* <span className="text-white text-sm font-medium">{stat.change}</span> */}
              {/* </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            </div>
          ))} */}
        {/* </div> */}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Security Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Overview</h3>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Security metrics visualization</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: "Threat blocked", time: "2 minutes ago", type: "security" },
                { action: "User login", time: "5 minutes ago", type: "info" },
                { action: "System update", time: "1 hour ago", type: "update" },
                { action: "Backup completed", time: "2 hours ago", type: "success" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'security' ? 'bg-red-500' :
                    activity.type === 'info' ? 'bg-blue-500' :
                      activity.type === 'update' ? 'bg-orange-500' : 'bg-green-500'
                    }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> 

        {/* Quick Actions */}
        {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
              <Shield className="w-6 h-6 mb-2" />
              <span className="block font-medium">Run Security Scan</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
              <Users className="w-6 h-6 mb-2" />
              <span className="block font-medium">Manage Users</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:opacity-90 transition-opacity">
              <BarChart3 className="w-6 h-6 mb-2" />
              <span className="block font-medium">View Reports</span>
            </button>
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default Dashboard;