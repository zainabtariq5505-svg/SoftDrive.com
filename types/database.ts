export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          storage_used: number;
          storage_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          storage_used?: number;
          storage_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          storage_used?: number;
          storage_limit?: number;
          updated_at?: string;
        };
      };
      files: {
        Row: {
          id: string;
          user_id: string;
          folder_id: string | null;
          name: string;
          original_name: string;
          size: number;
          mime_type: string;
          storage_path: string;
          thumbnail_path: string | null;
          is_starred: boolean;
          is_trashed: boolean;
          trashed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          folder_id?: string | null;
          name: string;
          original_name: string;
          size: number;
          mime_type: string;
          storage_path: string;
          thumbnail_path?: string | null;
          is_starred?: boolean;
          is_trashed?: boolean;
          trashed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          folder_id?: string | null;
          name?: string;
          original_name?: string;
          size?: number;
          mime_type?: string;
          storage_path?: string;
          thumbnail_path?: string | null;
          is_starred?: boolean;
          is_trashed?: boolean;
          trashed_at?: string | null;
          updated_at?: string;
        };
      };
      folders: {
        Row: {
          id: string;
          user_id: string;
          parent_id: string | null;
          name: string;
          is_starred: boolean;
          is_trashed: boolean;
          trashed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          parent_id?: string | null;
          name: string;
          is_starred?: boolean;
          is_trashed?: boolean;
          trashed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          parent_id?: string | null;
          name?: string;
          is_starred?: boolean;
          is_trashed?: boolean;
          trashed_at?: string | null;
          updated_at?: string;
        };
      };
      shared_links: {
        Row: {
          id: string;
          file_id: string | null;
          folder_id: string | null;
          created_by: string;
          token: string;
          permission: "view" | "download" | "edit";
          is_public: boolean;
          password_hash: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_id?: string | null;
          folder_id?: string | null;
          created_by: string;
          token?: string;
          permission?: "view" | "download" | "edit";
          is_public?: boolean;
          password_hash?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          permission?: "view" | "download" | "edit";
          is_public?: boolean;
          password_hash?: string | null;
          expires_at?: string | null;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          file_id: string | null;
          folder_id: string | null;
          action: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_id?: string | null;
          folder_id?: string | null;
          action: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: never;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: "free" | "pro" | "enterprise";
          status: "active" | "cancelled" | "expired";
          storage_limit: number;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: "free" | "pro" | "enterprise";
          status?: "active" | "cancelled" | "expired";
          storage_limit?: number;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          plan?: "free" | "pro" | "enterprise";
          status?: "active" | "cancelled" | "expired";
          storage_limit?: number;
          expires_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
