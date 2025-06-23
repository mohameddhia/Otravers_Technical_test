import React from "react";

export interface User {
    id: string;
    username: string;
    role : "SuperAdmin" | "Partner" | "RAF" | "Datacollector"
    validated: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }
  
  export interface LoginResponse {
    user: User;
    accessToken: string;
  }
  
  export interface ApiError {
    message: string;
    code: string;
    status: number;
  }
  export interface AuthRouterProps{
    children: React.ReactNode;
    allowedRoles? : string[];
  }
