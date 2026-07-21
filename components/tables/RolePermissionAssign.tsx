"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

interface RoleType {
  _id: string;
  name: string;
  permissions: string[];
}

interface PermissionType {
  _id: string;
  name: string;
  label: string;
}

const RolePermissionAssign = () => {

  const [roles,setRoles] = useState<RoleType[]>([]);
  const [permissions,setPermissions] = useState<PermissionType[]>([]);
  const [selectedRole,setSelectedRole] = useState<RoleType | null>(null);
  const [checked,setChecked] = useState<string[]>([]);
  const [loading,setLoading] = useState(false);

  // ✅ LOAD ALL ROLES
  const getRoles = async()=>{
    const res = await axios.get(
      process.env.apiUrl+"/api/get-all-role",
      {withCredentials:true}
    );
    setRoles(res.data.data);
  }

  // ✅ LOAD ALL PERMISSIONS
  const getPermissions = async()=>{
    const res = await axios.get(
      process.env.apiUrl+"/api/get-all-permission",
      {withCredentials:true}
    );
    setPermissions(res.data.data);
  }

  useEffect(()=>{
    getRoles();
    getPermissions();
  },[]);

  // ✅ ROLE SELECT
  const handleSelectRole = async(role:RoleType)=>{
    try{
      setLoading(true);

      const res = await axios.post(
        process.env.apiUrl+`/api/get-role-by-id/${role._id}`,
        {},
        {withCredentials:true}
      );

      const roleData = res.data.data;

      setSelectedRole(roleData);

      // already assigned permissions checked
      setChecked(roleData.permissions || []);
    }finally{
      setLoading(false);
    }
  }

  // ✅ TOGGLE CHECKBOX
  const togglePermission = (pid:string)=>{
    setChecked(prev =>
      prev.includes(pid)
        ? prev.filter(x=>x!==pid)
        : [...prev,pid]
    );
    
  }
  

  // ✅ SAVE ASSIGN / UNASSIGN
  const handleSave = async()=>{
    if(!selectedRole) return;

    try{
      setLoading(true);

      await axios.post(
        process.env.apiUrl+"/api/create-role",
        {
          id:selectedRole._id,
          name:selectedRole.name,
          permissions:checked
        },
        {withCredentials:true}
      );

      toast.success("Permissions updated");

      // reload roles
      getRoles();

    }catch{
      toast.error("Update failed");
    }finally{
      setLoading(false);
    }
  }

  return(
    <div className="flex gap-4 h-[500px] text-black">

      {/* LEFT SIDE ROLE LIST */}
      <div className="bg-white border rounded-lg overflow-auto w-64">
        <div className="p-3 font-bold border-b">Roles</div>

        {roles.map(role=>(
          <div
            key={role._id}
            onClick={()=>handleSelectRole(role)}
            className={`p-3 cursor-pointer border-b hover:bg-gray-100 capitalize font-semibold text-xl px-4
            ${selectedRole?._id===role._id ? "bg-blue-100" : ""}`}
          >
            {role?.name}
          </div>
        ))}
      </div>

      {/* RIGHT SIDE PERMISSION PANEL */}
      <div className=" bg-white border rounded-lg flex flex-col text-black flex-1">

        <div className="p-3 font-bold border-b">
          {selectedRole ? selectedRole.name+" Permissions" : "Select Role"}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress/>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-2 overflow-auto p-4 space-y-2">

            {permissions.map(p=>(
              <label
                key={p._id}
                className="flex items-center gap-3 border p-2 rounded hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={checked.includes(p._id)}
                  onChange={()=>togglePermission(p._id)}
                />

                <div>
                  <div className="font-semibold">{p.label}</div>
                  <div className="text-xs text-gray-500">{p.name}</div>
                </div>
              </label>
            ))}

          </div>
        )}

        {/* SAVE BUTTON */}
        {selectedRole && (
          <div className="p-3 border-t">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Update Permissions
            </button>
          </div>
        )}

      </div>

    </div>
  )
}

export default RolePermissionAssign;
