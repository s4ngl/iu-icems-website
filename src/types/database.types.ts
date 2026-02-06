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
      members: {
        Row: {
          user_id: string;
          first_name: string;
          last_name: string;
          iu_email: string;
          phone_number: string;
          gender: number;
          class_year: number;
          pronouns: number;
          position_club: number;
          position_web: number;
          psid: string;
          student_id: string;
          total_hours: number;
          pending_hours: number;
          dues_paid: boolean;
          dues_expiration: string | null;
          account_status: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          first_name: string;
          last_name: string;
          iu_email: string;
          phone_number: string;
          gender: number;
          class_year: number;
          pronouns: number;
          position_club?: number;
          position_web?: number;
          psid?: string;
          student_id?: string;
          total_hours?: number;
          pending_hours?: number;
          dues_paid?: boolean;
          dues_expiration?: string | null;
          account_status?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          first_name?: string;
          last_name?: string;
          iu_email?: string;
          phone_number?: string;
          gender?: number;
          class_year?: number;
          pronouns?: number;
          position_club?: number;
          position_web?: number;
          psid?: string;
          student_id?: string;
          total_hours?: number;
          pending_hours?: number;
          dues_paid?: boolean;
          dues_expiration?: string | null;
          account_status?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      emergency_contacts: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          phone_number: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          phone_number: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          phone_number?: string;
        };
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
        ];
      };
      certifications: {
        Row: {
          cert_id: string;
          user_id: string;
          cert_type: number;
          file_path: string;
          upload_date: string;
          is_approved: boolean;
          expiration_date: string | null;
          approved_by: string | null;
          approved_date: string | null;
        };
        Insert: {
          cert_id?: string;
          user_id: string;
          cert_type: number;
          file_path: string;
          upload_date?: string;
          is_approved?: boolean;
          expiration_date?: string | null;
          approved_by?: string | null;
          approved_date?: string | null;
        };
        Update: {
          cert_id?: string;
          user_id?: string;
          cert_type?: number;
          file_path?: string;
          upload_date?: string;
          is_approved?: boolean;
          expiration_date?: string | null;
          approved_by?: string | null;
          approved_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "certifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "certifications_approved_by_fkey";
            columns: ["approved_by"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
        ];
      };
      events: {
        Row: {
          event_id: string;
          event_name: string;
          event_date: string;
          start_time: string;
          end_time: string;
          location: string;
          description: string | null;
          fa_emr_needed: number;
          emt_needed: number;
          supervisor_needed: number;
          is_finalized: boolean;
          created_by: string;
          created_at: string;
        };
        Insert: {
          event_id?: string;
          event_name: string;
          event_date: string;
          start_time: string;
          end_time: string;
          location: string;
          description?: string | null;
          fa_emr_needed?: number;
          emt_needed?: number;
          supervisor_needed?: number;
          is_finalized?: boolean;
          created_by: string;
          created_at?: string;
        };
        Update: {
          event_id?: string;
          event_name?: string;
          event_date?: string;
          start_time?: string;
          end_time?: string;
          location?: string;
          description?: string | null;
          fa_emr_needed?: number;
          emt_needed?: number;
          supervisor_needed?: number;
          is_finalized?: boolean;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
        ];
      };
      event_signups: {
        Row: {
          signup_id: string;
          event_id: string;
          user_id: string;
          position_type: number;
          signup_time: string;
          is_assigned: boolean;
          assigned_by: string | null;
          assigned_time: string | null;
        };
        Insert: {
          signup_id?: string;
          event_id: string;
          user_id: string;
          position_type: number;
          signup_time?: string;
          is_assigned?: boolean;
          assigned_by?: string | null;
          assigned_time?: string | null;
        };
        Update: {
          signup_id?: string;
          event_id?: string;
          user_id?: string;
          position_type?: number;
          signup_time?: string;
          is_assigned?: boolean;
          assigned_by?: string | null;
          assigned_time?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_signups_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["event_id"];
          },
          {
            foreignKeyName: "event_signups_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "event_signups_assigned_by_fkey";
            columns: ["assigned_by"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
        ];
      };
      event_hours: {
        Row: {
          hour_id: string;
          event_id: string;
          user_id: string;
          calculated_hours: number;
          confirmed_hours: number | null;
          confirmed_by: string | null;
          is_confirmed: boolean;
          confirmed_date: string | null;
        };
        Insert: {
          hour_id?: string;
          event_id: string;
          user_id: string;
          calculated_hours: number;
          confirmed_hours?: number | null;
          confirmed_by?: string | null;
          is_confirmed?: boolean;
          confirmed_date?: string | null;
        };
        Update: {
          hour_id?: string;
          event_id?: string;
          user_id?: string;
          calculated_hours?: number;
          confirmed_hours?: number | null;
          confirmed_by?: string | null;
          is_confirmed?: boolean;
          confirmed_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_hours_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["event_id"];
          },
          {
            foreignKeyName: "event_hours_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "event_hours_confirmed_by_fkey";
            columns: ["confirmed_by"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
        ];
      };
      penalty_points: {
        Row: {
          point_id: string;
          user_id: string;
          points: number;
          reason: string;
          assigned_by: string;
          assigned_date: string;
          auto_remove_date: string | null;
          is_active: boolean;
        };
        Insert: {
          point_id?: string;
          user_id: string;
          points: number;
          reason: string;
          assigned_by: string;
          assigned_date?: string;
          auto_remove_date?: string | null;
          is_active?: boolean;
        };
        Update: {
          point_id?: string;
          user_id?: string;
          points?: number;
          reason?: string;
          assigned_by?: string;
          assigned_date?: string;
          auto_remove_date?: string | null;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "penalty_points_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "penalty_points_assigned_by_fkey";
            columns: ["assigned_by"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
        ];
      };
      training_sessions: {
        Row: {
          training_id: string;
          training_name: string;
          training_date: string;
          start_time: string;
          end_time: string;
          location: string;
          description: string | null;
          max_participants: number;
          is_aha_training: boolean;
          cpr_cost: number | null;
          fa_cost: number | null;
          both_cost: number | null;
          point_contact: string | null;
          created_by: string;
        };
        Insert: {
          training_id?: string;
          training_name: string;
          training_date: string;
          start_time: string;
          end_time: string;
          location: string;
          description?: string | null;
          max_participants: number;
          is_aha_training?: boolean;
          cpr_cost?: number | null;
          fa_cost?: number | null;
          both_cost?: number | null;
          point_contact?: string | null;
          created_by: string;
        };
        Update: {
          training_id?: string;
          training_name?: string;
          training_date?: string;
          start_time?: string;
          end_time?: string;
          location?: string;
          description?: string | null;
          max_participants?: number;
          is_aha_training?: boolean;
          cpr_cost?: number | null;
          fa_cost?: number | null;
          both_cost?: number | null;
          point_contact?: string | null;
          created_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "training_sessions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
        ];
      };
      training_signups: {
        Row: {
          signup_id: string;
          training_id: string;
          user_id: string;
          signup_type: number;
          payment_confirmed: boolean;
          confirmed_by: string | null;
          signup_time: string;
        };
        Insert: {
          signup_id?: string;
          training_id: string;
          user_id: string;
          signup_type: number;
          payment_confirmed?: boolean;
          confirmed_by?: string | null;
          signup_time?: string;
        };
        Update: {
          signup_id?: string;
          training_id?: string;
          user_id?: string;
          signup_type?: number;
          payment_confirmed?: boolean;
          confirmed_by?: string | null;
          signup_time?: string;
        };
        Relationships: [
          {
            foreignKeyName: "training_signups_training_id_fkey";
            columns: ["training_id"];
            isOneToOne: false;
            referencedRelation: "training_sessions";
            referencedColumns: ["training_id"];
          },
          {
            foreignKeyName: "training_signups_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "training_signups_confirmed_by_fkey";
            columns: ["confirmed_by"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["user_id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}