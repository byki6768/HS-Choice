export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string;
          content: string;
          created_at: string;
          game_id: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string;
          game_id: string;
          id?: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string;
          game_id?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
        ];
      };
      games: {
        Row: {
          author_id: string;
          created_at: string;
          id: string;
          option_a: string;
          option_a_image_path: string | null;
          option_b: string;
          option_b_image_path: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          created_at?: string;
          id?: string;
          option_a: string;
          option_a_image_path?: string | null;
          option_b: string;
          option_b_image_path?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          created_at?: string;
          id?: string;
          option_a?: string;
          option_a_image_path?: string | null;
          option_b?: string;
          option_b_image_path?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "games_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          country_code: string | null;
          created_at: string;
          id: string;
          nickname: string | null;
          phone: string | null;
          updated_at: string;
          withdrawn_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          country_code?: string | null;
          created_at?: string;
          id: string;
          nickname?: string | null;
          phone?: string | null;
          updated_at?: string;
          withdrawn_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          country_code?: string | null;
          created_at?: string;
          id?: string;
          nickname?: string | null;
          phone?: string | null;
          updated_at?: string;
          withdrawn_at?: string | null;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          created_at: string;
          game_id: string;
          guest_key: string | null;
          id: string;
          option: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          game_id: string;
          guest_key?: string | null;
          id?: string;
          option: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          game_id?: string;
          guest_key?: string | null;
          id?: string;
          option?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "votes_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      auth_account_exists: {
        Args: { identifier: string };
        Returns: boolean;
      };
      delete_own_account: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
