export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      approvals: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          caption: string | null
          client_feedback: string | null
          client_id: string
          content_request_id: string
          created_at: string
          draft_content: string | null
          draft_url: string | null
          id: string
          revision_notes: string | null
          status: string | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          caption?: string | null
          client_feedback?: string | null
          client_id: string
          content_request_id: string
          created_at?: string
          draft_content?: string | null
          draft_url?: string | null
          id?: string
          revision_notes?: string | null
          status?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          caption?: string | null
          client_feedback?: string | null
          client_id?: string
          content_request_id?: string
          created_at?: string
          draft_content?: string | null
          draft_url?: string | null
          id?: string
          revision_notes?: string | null
          status?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_content_request_id_fkey"
            columns: ["content_request_id"]
            isOneToOne: false
            referencedRelation: "content_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      audience_profiles: {
        Row: {
          active_platforms: string[] | null
          age_range: string | null
          aspirations: string[] | null
          audience_description: string
          audience_name: string
          audience_values: string[] | null
          brand_voice_id: string
          call_to_action_style: string | null
          challenges: string[] | null
          communication_style: string | null
          content_consumption_habits: string | null
          content_format_preference: string[] | null
          content_topics: string[] | null
          created_at: string | null
          decision_making_factors: string[] | null
          education_level: string | null
          emotional_drivers: string[] | null
          engagement_patterns: string | null
          goals: string[]
          id: string
          income_level: string | null
          interests: string[] | null
          is_active: boolean | null
          language_preferences: string[] | null
          lifestyle: string | null
          location: string | null
          messaging_angles: string[] | null
          occupation: string | null
          pain_points: string[]
          preferred_tone: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_platforms?: string[] | null
          age_range?: string | null
          aspirations?: string[] | null
          audience_description: string
          audience_name: string
          audience_values?: string[] | null
          brand_voice_id: string
          call_to_action_style?: string | null
          challenges?: string[] | null
          communication_style?: string | null
          content_consumption_habits?: string | null
          content_format_preference?: string[] | null
          content_topics?: string[] | null
          created_at?: string | null
          decision_making_factors?: string[] | null
          education_level?: string | null
          emotional_drivers?: string[] | null
          engagement_patterns?: string | null
          goals: string[]
          id?: string
          income_level?: string | null
          interests?: string[] | null
          is_active?: boolean | null
          language_preferences?: string[] | null
          lifestyle?: string | null
          location?: string | null
          messaging_angles?: string[] | null
          occupation?: string | null
          pain_points: string[]
          preferred_tone?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_platforms?: string[] | null
          age_range?: string | null
          aspirations?: string[] | null
          audience_description?: string
          audience_name?: string
          audience_values?: string[] | null
          brand_voice_id?: string
          call_to_action_style?: string | null
          challenges?: string[] | null
          communication_style?: string | null
          content_consumption_habits?: string | null
          content_format_preference?: string[] | null
          content_topics?: string[] | null
          created_at?: string | null
          decision_making_factors?: string[] | null
          education_level?: string | null
          emotional_drivers?: string[] | null
          engagement_patterns?: string | null
          goals?: string[]
          id?: string
          income_level?: string | null
          interests?: string[] | null
          is_active?: boolean | null
          language_preferences?: string[] | null
          lifestyle?: string | null
          location?: string | null
          messaging_angles?: string[] | null
          occupation?: string | null
          pain_points?: string[]
          preferred_tone?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audience_profiles_brand_voice_id_fkey"
            columns: ["brand_voice_id"]
            isOneToOne: false
            referencedRelation: "brand_voices"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_hub: {
        Row: {
          audience_profiles: Json | null
          brand_mission: string | null
          brand_name: string | null
          brand_personality: string | null
          brand_values: string | null
          created_at: string | null
          do_phrases: Json | null
          dont_phrases: Json | null
          example_content: Json | null
          goals: Json | null
          id: string
          project_id: string | null
          unique_selling_proposition: string | null
          updated_at: string | null
          voice_style: string | null
          voice_tone: string | null
        }
        Insert: {
          audience_profiles?: Json | null
          brand_mission?: string | null
          brand_name?: string | null
          brand_personality?: string | null
          brand_values?: string | null
          created_at?: string | null
          do_phrases?: Json | null
          dont_phrases?: Json | null
          example_content?: Json | null
          goals?: Json | null
          id?: string
          project_id?: string | null
          unique_selling_proposition?: string | null
          updated_at?: string | null
          voice_style?: string | null
          voice_tone?: string | null
        }
        Update: {
          audience_profiles?: Json | null
          brand_mission?: string | null
          brand_name?: string | null
          brand_personality?: string | null
          brand_values?: string | null
          created_at?: string | null
          do_phrases?: Json | null
          dont_phrases?: Json | null
          example_content?: Json | null
          goals?: Json | null
          id?: string
          project_id?: string | null
          unique_selling_proposition?: string | null
          updated_at?: string | null
          voice_style?: string | null
          voice_tone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_hub_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_voices: {
        Row: {
          best_used_for: string[] | null
          brand_mission: string | null
          brand_personality: string | null
          brand_values_text: string | null
          content_length_preference: string | null
          content_types: string[] | null
          created_at: string | null
          created_by_method: string | null
          description: string | null
          id: string
          name: string
          resource_1: string | null
          resource_2: string | null
          resource_3: string | null
          sentence_structure_preference: string | null
          status: string | null
          tags: string[] | null
          tone_characteristics: string[] | null
          updated_at: string | null
          user_id: string
          vocabulary_preferences: string[] | null
          voice_description: string | null
          voice_values: string[] | null
          writing_guidelines: string | null
          writing_style_notes: string | null
        }
        Insert: {
          best_used_for?: string[] | null
          brand_mission?: string | null
          brand_personality?: string | null
          brand_values_text?: string | null
          content_length_preference?: string | null
          content_types?: string[] | null
          created_at?: string | null
          created_by_method?: string | null
          description?: string | null
          id?: string
          name?: string
          resource_1?: string | null
          resource_2?: string | null
          resource_3?: string | null
          sentence_structure_preference?: string | null
          status?: string | null
          tags?: string[] | null
          tone_characteristics?: string[] | null
          updated_at?: string | null
          user_id: string
          vocabulary_preferences?: string[] | null
          voice_description?: string | null
          voice_values?: string[] | null
          writing_guidelines?: string | null
          writing_style_notes?: string | null
        }
        Update: {
          best_used_for?: string[] | null
          brand_mission?: string | null
          brand_personality?: string | null
          brand_values_text?: string | null
          content_length_preference?: string | null
          content_types?: string[] | null
          created_at?: string | null
          created_by_method?: string | null
          description?: string | null
          id?: string
          name?: string
          resource_1?: string | null
          resource_2?: string | null
          resource_3?: string | null
          sentence_structure_preference?: string | null
          status?: string | null
          tags?: string[] | null
          tone_characteristics?: string[] | null
          updated_at?: string | null
          user_id?: string
          vocabulary_preferences?: string[] | null
          voice_description?: string | null
          voice_values?: string[] | null
          writing_guidelines?: string | null
          writing_style_notes?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string | null
          id: string
          instagram_url: string | null
          name: string
          niche: string | null
          notes: string | null
          phone: string | null
          status: string | null
          tiktok_url: string | null
          updated_at: string
          website: string | null
          youtube_url: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          instagram_url?: string | null
          name: string
          niche?: string | null
          notes?: string | null
          phone?: string | null
          status?: string | null
          tiktok_url?: string | null
          updated_at?: string
          website?: string | null
          youtube_url?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          instagram_url?: string | null
          name?: string
          niche?: string | null
          notes?: string | null
          phone?: string | null
          status?: string | null
          tiktok_url?: string | null
          updated_at?: string
          website?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      cms_activity_log: {
        Row: {
          action: string
          content_item_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          content_item_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          content_item_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_activity_log_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "cms_content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_activity_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_approval_events: {
        Row: {
          approved_by: string
          content_item_id: string
          created_at: string | null
          decision: string
          id: string
          note: string | null
        }
        Insert: {
          approved_by: string
          content_item_id: string
          created_at?: string | null
          decision: string
          id?: string
          note?: string | null
        }
        Update: {
          approved_by?: string
          content_item_id?: string
          created_at?: string | null
          decision?: string
          id?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_approval_events_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "cms_content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_audits: {
        Row: {
          challenges: string | null
          converted_at: string | null
          converted_by: string | null
          converted_to_project_id: string | null
          created_at: string | null
          created_by: string | null
          goals: string | null
          id: string
          instagram_url: string | null
          lead_company: string | null
          lead_email: string | null
          lead_name: string | null
          report_link: string | null
          sections: Json | null
          status: Database["public"]["Enums"]["audit_status"] | null
          target_audience: string | null
          tiktok_url: string | null
          updated_at: string | null
          website_url: string | null
          youtube_url: string | null
        }
        Insert: {
          challenges?: string | null
          converted_at?: string | null
          converted_by?: string | null
          converted_to_project_id?: string | null
          created_at?: string | null
          created_by?: string | null
          goals?: string | null
          id?: string
          instagram_url?: string | null
          lead_company?: string | null
          lead_email?: string | null
          lead_name?: string | null
          report_link?: string | null
          sections?: Json | null
          status?: Database["public"]["Enums"]["audit_status"] | null
          target_audience?: string | null
          tiktok_url?: string | null
          updated_at?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          challenges?: string | null
          converted_at?: string | null
          converted_by?: string | null
          converted_to_project_id?: string | null
          created_at?: string | null
          created_by?: string | null
          goals?: string | null
          id?: string
          instagram_url?: string | null
          lead_company?: string | null
          lead_email?: string | null
          lead_name?: string | null
          report_link?: string | null
          sections?: Json | null
          status?: Database["public"]["Enums"]["audit_status"] | null
          target_audience?: string | null
          tiktok_url?: string | null
          updated_at?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_audits_converted_to_project_id_fkey"
            columns: ["converted_to_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_comments: {
        Row: {
          author_id: string
          comment_type: string | null
          content_item_id: string
          created_at: string | null
          id: string
          message: string
        }
        Insert: {
          author_id: string
          comment_type?: string | null
          content_item_id: string
          created_at?: string | null
          id?: string
          message: string
        }
        Update: {
          author_id?: string
          comment_type?: string | null
          content_item_id?: string
          created_at?: string | null
          id?: string
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_comments_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "cms_content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_items: {
        Row: {
          actual_publish_date: string | null
          caption_text: string | null
          content_number: string | null
          content_type: Database["public"]["Enums"]["content_type_enum"] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          drive_folder_link: string | null
          editor_id: string | null
          final_asset_link: string | null
          frame_project_link: string | null
          id: string
          needs_caption: boolean | null
          needs_script: boolean | null
          needs_thumbnail: boolean | null
          owner_id: string | null
          platform_post_ids: Json | null
          platforms: Database["public"]["Enums"]["platform_enum"][] | null
          priority: string | null
          project_id: string
          published_url: string | null
          repurposed_from_id: string | null
          script_content: string | null
          script_doc_link: string | null
          source_id: string | null
          source_type: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          tags: string[] | null
          target_publish_date: string | null
          thumbnail_brief: string | null
          title: string
          title_final: string | null
          updated_at: string | null
        }
        Insert: {
          actual_publish_date?: string | null
          caption_text?: string | null
          content_number?: string | null
          content_type?: Database["public"]["Enums"]["content_type_enum"] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          drive_folder_link?: string | null
          editor_id?: string | null
          final_asset_link?: string | null
          frame_project_link?: string | null
          id?: string
          needs_caption?: boolean | null
          needs_script?: boolean | null
          needs_thumbnail?: boolean | null
          owner_id?: string | null
          platform_post_ids?: Json | null
          platforms?: Database["public"]["Enums"]["platform_enum"][] | null
          priority?: string | null
          project_id: string
          published_url?: string | null
          repurposed_from_id?: string | null
          script_content?: string | null
          script_doc_link?: string | null
          source_id?: string | null
          source_type?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          target_publish_date?: string | null
          thumbnail_brief?: string | null
          title: string
          title_final?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_publish_date?: string | null
          caption_text?: string | null
          content_number?: string | null
          content_type?: Database["public"]["Enums"]["content_type_enum"] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          drive_folder_link?: string | null
          editor_id?: string | null
          final_asset_link?: string | null
          frame_project_link?: string | null
          id?: string
          needs_caption?: boolean | null
          needs_script?: boolean | null
          needs_thumbnail?: boolean | null
          owner_id?: string | null
          platform_post_ids?: Json | null
          platforms?: Database["public"]["Enums"]["platform_enum"][] | null
          priority?: string | null
          project_id?: string
          published_url?: string | null
          repurposed_from_id?: string | null
          script_content?: string | null
          script_doc_link?: string | null
          source_id?: string | null
          source_type?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          target_publish_date?: string | null
          thumbnail_brief?: string | null
          title?: string
          title_final?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_content_items_repurposed_from_id_fkey"
            columns: ["repurposed_from_id"]
            isOneToOne: false
            referencedRelation: "cms_content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_integration_config: {
        Row: {
          created_at: string | null
          drive_folder_template: string | null
          drive_root_folder_id: string | null
          frame_team_id: string | null
          id: string
          project_id: string | null
          slack_channel_id: string | null
          slack_notification_types: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          drive_folder_template?: string | null
          drive_root_folder_id?: string | null
          frame_team_id?: string | null
          id?: string
          project_id?: string | null
          slack_channel_id?: string | null
          slack_notification_types?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          drive_folder_template?: string | null
          drive_root_folder_id?: string | null
          frame_team_id?: string | null
          id?: string
          project_id?: string | null
          slack_channel_id?: string | null
          slack_notification_types?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_integration_config_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_templates: {
        Row: {
          content_type: Database["public"]["Enums"]["content_type_enum"] | null
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          template_text: string | null
          template_type: string | null
          updated_at: string | null
        }
        Insert: {
          content_type?: Database["public"]["Enums"]["content_type_enum"] | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          template_text?: string | null
          template_type?: string | null
          updated_at?: string | null
        }
        Update: {
          content_type?: Database["public"]["Enums"]["content_type_enum"] | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          template_text?: string | null
          template_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_weekly_reports: {
        Row: {
          created_at: string | null
          id: string
          items_approved: number | null
          items_blocked: number | null
          items_published: number | null
          items_rejected: number | null
          next_week_schedule: Json | null
          project_id: string
          recommendations: Json | null
          report_url: string | null
          sent_at: string | null
          summary: string | null
          updated_at: string | null
          week_end: string
          week_start: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          items_approved?: number | null
          items_blocked?: number | null
          items_published?: number | null
          items_rejected?: number | null
          next_week_schedule?: Json | null
          project_id: string
          recommendations?: Json | null
          report_url?: string | null
          sent_at?: string | null
          summary?: string | null
          updated_at?: string | null
          week_end: string
          week_start: string
        }
        Update: {
          created_at?: string | null
          id?: string
          items_approved?: number | null
          items_blocked?: number | null
          items_published?: number | null
          items_rejected?: number | null
          next_week_schedule?: Json | null
          project_id?: string
          recommendations?: Json | null
          report_url?: string | null
          sent_at?: string | null
          summary?: string | null
          updated_at?: string | null
          week_end?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_weekly_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      communications_log: {
        Row: {
          category: string | null
          client_id: string
          content_request_id: string | null
          created_at: string
          file_url: string | null
          id: string
          message_content: string | null
          message_type: string | null
          priority: string | null
          sender_id: string | null
          sender_type: string | null
          sentiment: string | null
          source: string | null
          summary: string | null
        }
        Insert: {
          category?: string | null
          client_id: string
          content_request_id?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          message_content?: string | null
          message_type?: string | null
          priority?: string | null
          sender_id?: string | null
          sender_type?: string | null
          sentiment?: string | null
          source?: string | null
          summary?: string | null
        }
        Update: {
          category?: string | null
          client_id?: string
          content_request_id?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          message_content?: string | null
          message_type?: string | null
          priority?: string | null
          sender_id?: string | null
          sender_type?: string | null
          sentiment?: string | null
          source?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_log_content_request_id_fkey"
            columns: ["content_request_id"]
            isOneToOne: false
            referencedRelation: "content_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_analysis: {
        Row: {
          analysis_date: string | null
          comment_count: number | null
          competitor_name: string
          created_at: string | null
          downloadable_link: string | null
          followers: number | null
          hashtags: string | null
          id: string
          music_url: string | null
          platform: string
          post: string | null
          post_created_date: string | null
          post_url: string | null
          profile_url: string | null
          share_count: number | null
          total_posts: number | null
          tracked_profile_id: string | null
          updated_at: string | null
          user_id: string
          username: string | null
          video_duration: string | null
          views: number | null
        }
        Insert: {
          analysis_date?: string | null
          comment_count?: number | null
          competitor_name: string
          created_at?: string | null
          downloadable_link?: string | null
          followers?: number | null
          hashtags?: string | null
          id?: string
          music_url?: string | null
          platform: string
          post?: string | null
          post_created_date?: string | null
          post_url?: string | null
          profile_url?: string | null
          share_count?: number | null
          total_posts?: number | null
          tracked_profile_id?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          video_duration?: string | null
          views?: number | null
        }
        Update: {
          analysis_date?: string | null
          comment_count?: number | null
          competitor_name?: string
          created_at?: string | null
          downloadable_link?: string | null
          followers?: number | null
          hashtags?: string | null
          id?: string
          music_url?: string | null
          platform?: string
          post?: string | null
          post_created_date?: string | null
          post_url?: string | null
          profile_url?: string | null
          share_count?: number | null
          total_posts?: number | null
          tracked_profile_id?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          video_duration?: string | null
          views?: number | null
        }
        Relationships: []
      }
      content_creation: {
        Row: {
          content_length: string | null
          contents: string | null
          created_at: string | null
          framework_id: string
          id: string
          planning_id: string
          platforms: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content_length?: string | null
          contents?: string | null
          created_at?: string | null
          framework_id: string
          id?: string
          planning_id: string
          platforms?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content_length?: string | null
          contents?: string | null
          created_at?: string | null
          framework_id?: string
          id?: string
          planning_id?: string
          platforms?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      content_framework: {
        Row: {
          created_at: string | null
          framework_name: string | null
          framework_text: string
          id: string
          planning_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          framework_name?: string | null
          framework_text: string
          id?: string
          planning_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          framework_name?: string | null
          framework_text?: string
          id?: string
          planning_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      content_ideation: {
        Row: {
          approval_status: string | null
          content_angle: string | null
          created_at: string | null
          hooks: string[] | null
          id: string
          keywords: string | null
          recommended_format: string | null
          recommended_platforms: string[] | null
          selection_rationale: string | null
          selection_score: number | null
          source_summary: string | null
          source_type: string | null
          target_pain_point: string | null
          topic: string | null
          topic_overview: string | null
          updated_at: string | null
          used: boolean | null
          user_id: string
        }
        Insert: {
          approval_status?: string | null
          content_angle?: string | null
          created_at?: string | null
          hooks?: string[] | null
          id?: string
          keywords?: string | null
          recommended_format?: string | null
          recommended_platforms?: string[] | null
          selection_rationale?: string | null
          selection_score?: number | null
          source_summary?: string | null
          source_type?: string | null
          target_pain_point?: string | null
          topic?: string | null
          topic_overview?: string | null
          updated_at?: string | null
          used?: boolean | null
          user_id: string
        }
        Update: {
          approval_status?: string | null
          content_angle?: string | null
          created_at?: string | null
          hooks?: string[] | null
          id?: string
          keywords?: string | null
          recommended_format?: string | null
          recommended_platforms?: string[] | null
          selection_rationale?: string | null
          selection_score?: number | null
          source_summary?: string | null
          source_type?: string | null
          target_pain_point?: string | null
          topic?: string | null
          topic_overview?: string | null
          updated_at?: string | null
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      content_planning: {
        Row: {
          audience_id: string | null
          board_group_id: string
          content_type: string | null
          created_at: string | null
          custom_description: string | null
          custom_keywords: string[] | null
          custom_title: string | null
          id: string
          image_urls: string[] | null
          notes: string | null
          planning_status: string | null
          position_index: number | null
          promotional_level: string | null
          selected_framework_ids: string[] | null
          selected_platforms: string[] | null
          source: string | null
          topic_origin_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audience_id?: string | null
          board_group_id?: string
          content_type?: string | null
          created_at?: string | null
          custom_description?: string | null
          custom_keywords?: string[] | null
          custom_title?: string | null
          id?: string
          image_urls?: string[] | null
          notes?: string | null
          planning_status?: string | null
          position_index?: number | null
          promotional_level?: string | null
          selected_framework_ids?: string[] | null
          selected_platforms?: string[] | null
          source?: string | null
          topic_origin_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audience_id?: string | null
          board_group_id?: string
          content_type?: string | null
          created_at?: string | null
          custom_description?: string | null
          custom_keywords?: string[] | null
          custom_title?: string | null
          id?: string
          image_urls?: string[] | null
          notes?: string | null
          planning_status?: string | null
          position_index?: number | null
          promotional_level?: string | null
          selected_framework_ids?: string[] | null
          selected_platforms?: string[] | null
          source?: string | null
          topic_origin_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      content_requests: {
        Row: {
          assigned_to: string | null
          attachments: string[] | null
          client_id: string
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          request_type: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          attachments?: string[] | null
          client_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          request_type?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          attachments?: string[] | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          request_type?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          approval_status: string | null
          content: string
          content_type: string | null
          created_at: string | null
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          original_sender: string | null
          original_timestamp: string | null
          source_type: string
          updated_at: string | null
          used: boolean | null
          user_id: string
        }
        Insert: {
          approval_status?: string | null
          content: string
          content_type?: string | null
          created_at?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          original_sender?: string | null
          original_timestamp?: string | null
          source_type: string
          updated_at?: string | null
          used?: boolean | null
          user_id: string
        }
        Update: {
          approval_status?: string | null
          content?: string
          content_type?: string | null
          created_at?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          original_sender?: string | null
          original_timestamp?: string | null
          source_type?: string
          updated_at?: string | null
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_size: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          industry: string | null
          is_admin: boolean | null
          last_name: string | null
          notification_settings: Json | null
          onboarding_completed: boolean | null
          onboarding_status: string | null
          payment_date: string | null
          payment_status: string | null
          phone: string | null
          plan: string | null
          preferences: Json | null
          role: string | null
          slack_channel_id: string | null
          subscription_end_date: string | null
          subscription_id: string | null
          target_audience: string | null
          updated_at: string | null
          user_id: string
          username: string | null
          whatsapp_phone_number: string | null
          workspace_name: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_size?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          industry?: string | null
          is_admin?: boolean | null
          last_name?: string | null
          notification_settings?: Json | null
          onboarding_completed?: boolean | null
          onboarding_status?: string | null
          payment_date?: string | null
          payment_status?: string | null
          phone?: string | null
          plan?: string | null
          preferences?: Json | null
          role?: string | null
          slack_channel_id?: string | null
          subscription_end_date?: string | null
          subscription_id?: string | null
          target_audience?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          whatsapp_phone_number?: string | null
          workspace_name?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_size?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          industry?: string | null
          is_admin?: boolean | null
          last_name?: string | null
          notification_settings?: Json | null
          onboarding_completed?: boolean | null
          onboarding_status?: string | null
          payment_date?: string | null
          payment_status?: string | null
          phone?: string | null
          plan?: string | null
          preferences?: Json | null
          role?: string | null
          slack_channel_id?: string | null
          subscription_end_date?: string | null
          subscription_id?: string | null
          target_audience?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          whatsapp_phone_number?: string | null
          workspace_name?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      repurpose_content: {
        Row: {
          approval_status: string | null
          caption: string | null
          comments_count: number | null
          created_at: string | null
          display_url: string | null
          first_comment: string | null
          hashtags: string[] | null
          id: string
          likes_count: number | null
          new_transcript: string | null
          platform: string | null
          processing_status: string | null
          repurpose_topic: string | null
          research: string | null
          scraped_transcript: string | null
          short_code: string | null
          source_type: string | null
          steps: string | null
          suggestion: string | null
          timestamp: string | null
          updated_at: string | null
          url: string | null
          user_id: string | null
          username: string | null
          video_duration: string | null
          video_play_count: number | null
          video_url: string | null
          video_view_count: number | null
        }
        Insert: {
          approval_status?: string | null
          caption?: string | null
          comments_count?: number | null
          created_at?: string | null
          display_url?: string | null
          first_comment?: string | null
          hashtags?: string[] | null
          id: string
          likes_count?: number | null
          new_transcript?: string | null
          platform?: string | null
          processing_status?: string | null
          repurpose_topic?: string | null
          research?: string | null
          scraped_transcript?: string | null
          short_code?: string | null
          source_type?: string | null
          steps?: string | null
          suggestion?: string | null
          timestamp?: string | null
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
          username?: string | null
          video_duration?: string | null
          video_play_count?: number | null
          video_url?: string | null
          video_view_count?: number | null
        }
        Update: {
          approval_status?: string | null
          caption?: string | null
          comments_count?: number | null
          created_at?: string | null
          display_url?: string | null
          first_comment?: string | null
          hashtags?: string[] | null
          id?: string
          likes_count?: number | null
          new_transcript?: string | null
          platform?: string | null
          processing_status?: string | null
          repurpose_topic?: string | null
          research?: string | null
          scraped_transcript?: string | null
          short_code?: string | null
          source_type?: string | null
          steps?: string | null
          suggestion?: string | null
          timestamp?: string | null
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
          username?: string | null
          video_duration?: string | null
          video_play_count?: number | null
          video_url?: string | null
          video_view_count?: number | null
        }
        Relationships: []
      }
      social_audits: {
        Row: {
          admin_notes: string | null
          audience_profile: Json | null
          brand_voice_analysis: Json | null
          client_id: string | null
          content_strategy: Json | null
          created_at: string
          created_by: string | null
          engagement_patterns: Json | null
          id: string
          payment_amount: number | null
          payment_status: string | null
          recommendations: Json | null
          sent_at: string | null
          status: string | null
          strengths: string[] | null
          updated_at: string
          viewed_at: string | null
          weaknesses: string[] | null
        }
        Insert: {
          admin_notes?: string | null
          audience_profile?: Json | null
          brand_voice_analysis?: Json | null
          client_id?: string | null
          content_strategy?: Json | null
          created_at?: string
          created_by?: string | null
          engagement_patterns?: Json | null
          id?: string
          payment_amount?: number | null
          payment_status?: string | null
          recommendations?: Json | null
          sent_at?: string | null
          status?: string | null
          strengths?: string[] | null
          updated_at?: string
          viewed_at?: string | null
          weaknesses?: string[] | null
        }
        Update: {
          admin_notes?: string | null
          audience_profile?: Json | null
          brand_voice_analysis?: Json | null
          client_id?: string | null
          content_strategy?: Json | null
          created_at?: string
          created_by?: string | null
          engagement_patterns?: Json | null
          id?: string
          payment_amount?: number | null
          payment_status?: string | null
          recommendations?: Json | null
          sent_at?: string | null
          status?: string | null
          strengths?: string[] | null
          updated_at?: string
          viewed_at?: string | null
          weaknesses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "social_audits_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      social_trend_analysis: {
        Row: {
          analysis_date: string | null
          channel_url: string | null
          created_at: string | null
          hashtags: string | null
          id: string
          platform: string | null
          post: string | null
          post_created_date: string | null
          subscribers: string | null
          topic: string | null
          tracked_profile_id: string | null
          updated_at: string | null
          user_id: string | null
          user_name: string | null
          video_duration: string | null
          video_transcript: string | null
          video_url: string | null
          video_views: number | null
        }
        Insert: {
          analysis_date?: string | null
          channel_url?: string | null
          created_at?: string | null
          hashtags?: string | null
          id?: string
          platform?: string | null
          post?: string | null
          post_created_date?: string | null
          subscribers?: string | null
          topic?: string | null
          tracked_profile_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_name?: string | null
          video_duration?: string | null
          video_transcript?: string | null
          video_url?: string | null
          video_views?: number | null
        }
        Update: {
          analysis_date?: string | null
          channel_url?: string | null
          created_at?: string | null
          hashtags?: string | null
          id?: string
          platform?: string | null
          post?: string | null
          post_created_date?: string | null
          subscribers?: string | null
          topic?: string | null
          tracked_profile_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_name?: string | null
          video_duration?: string | null
          video_transcript?: string | null
          video_url?: string | null
          video_views?: number | null
        }
        Relationships: []
      }
      system_prompts: {
        Row: {
          competitor_analysis_idation_agent_system_prompt: string | null
          competitor_analysis_idation_agent_user_prompt: string | null
          content_creation_agent_system_prompt: string | null
          content_creation_agent_user_prompt: string | null
          created_at: string | null
          framework_agent_system_prompt: string | null
          framework_agent_user_prompt: string | null
          id: string
          idea_agent_system_prompt: string | null
          idea_agent_user_prompt: string | null
          image_generation_agent_system_prompt: string | null
          image_generation_agent_user_prompt: string | null
          knowledgebase_ideation_agent_system_prompt: string | null
          knowledgebase_ideation_agent_user_prompt: string | null
          research_agent_system_prompt: string | null
          research_agent_user_prompt: string | null
          socialtrend_analysis_system_prompt: string | null
          socialtrend_analysis_user_prompt: string | null
          updated_at: string | null
          user_id: string
          video_script_generation_agent_user_prompt: string | null
        }
        Insert: {
          competitor_analysis_idation_agent_system_prompt?: string | null
          competitor_analysis_idation_agent_user_prompt?: string | null
          content_creation_agent_system_prompt?: string | null
          content_creation_agent_user_prompt?: string | null
          created_at?: string | null
          framework_agent_system_prompt?: string | null
          framework_agent_user_prompt?: string | null
          id?: string
          idea_agent_system_prompt?: string | null
          idea_agent_user_prompt?: string | null
          image_generation_agent_system_prompt?: string | null
          image_generation_agent_user_prompt?: string | null
          knowledgebase_ideation_agent_system_prompt?: string | null
          knowledgebase_ideation_agent_user_prompt?: string | null
          research_agent_system_prompt?: string | null
          research_agent_user_prompt?: string | null
          socialtrend_analysis_system_prompt?: string | null
          socialtrend_analysis_user_prompt?: string | null
          updated_at?: string | null
          user_id: string
          video_script_generation_agent_user_prompt?: string | null
        }
        Update: {
          competitor_analysis_idation_agent_system_prompt?: string | null
          competitor_analysis_idation_agent_user_prompt?: string | null
          content_creation_agent_system_prompt?: string | null
          content_creation_agent_user_prompt?: string | null
          created_at?: string | null
          framework_agent_system_prompt?: string | null
          framework_agent_user_prompt?: string | null
          id?: string
          idea_agent_system_prompt?: string | null
          idea_agent_user_prompt?: string | null
          image_generation_agent_system_prompt?: string | null
          image_generation_agent_user_prompt?: string | null
          knowledgebase_ideation_agent_system_prompt?: string | null
          knowledgebase_ideation_agent_user_prompt?: string | null
          research_agent_system_prompt?: string | null
          research_agent_user_prompt?: string | null
          socialtrend_analysis_system_prompt?: string | null
          socialtrend_analysis_user_prompt?: string | null
          updated_at?: string | null
          user_id?: string
          video_script_generation_agent_user_prompt?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_tracked_profiles: {
        Row: {
          created_at: string | null
          date_refresh_date: string | null
          id: string
          is_active: boolean | null
          keyword: string | null
          platform: string
          profile_name: string
          profile_type: string
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string | null
          date_refresh_date?: string | null
          id?: string
          is_active?: boolean | null
          keyword?: string | null
          platform: string
          profile_name: string
          profile_type?: string
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string | null
          date_refresh_date?: string | null
          id?: string
          is_active?: boolean | null
          keyword?: string | null
          platform?: string
          profile_name?: string
          profile_type?: string
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      weekly_reports: {
        Row: {
          client_id: string
          created_at: string
          id: string
          kpis: Json | null
          posts_approved: number | null
          posts_published: number | null
          posts_rejected: number | null
          recommendations: string[] | null
          report_url: string | null
          sent_at: string | null
          summary: string | null
          updated_at: string
          week_end: string
          week_start: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          kpis?: Json | null
          posts_approved?: number | null
          posts_published?: number | null
          posts_rejected?: number | null
          recommendations?: string[] | null
          report_url?: string | null
          sent_at?: string | null
          summary?: string | null
          updated_at?: string
          week_end: string
          week_start: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          kpis?: Json | null
          posts_approved?: number | null
          posts_published?: number | null
          posts_rejected?: number | null
          recommendations?: string[] | null
          report_url?: string | null
          sent_at?: string | null
          summary?: string | null
          updated_at?: string
          week_end?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          category: string | null
          created_at: string
          id: number
          media_link: string | null
          message: string | null
          message_send_time: string
          message_summary: string | null
          name: string | null
          sender: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: number
          media_link?: string | null
          message?: string | null
          message_send_time: string
          message_summary?: string | null
          name?: string | null
          sender: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: number
          media_link?: string | null
          message?: string | null
          message_send_time?: string
          message_summary?: string | null
          name?: string | null
          sender?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      append_image_url: {
        Args: { new_url: string; row_id: string }
        Returns: undefined
      }
      associate_whatsapp_messages_with_users: {
        Args: never
        Returns: undefined
      }
      get_content_workflow_chain: {
        Args: { p_user_id: string }
        Returns: {
          creation_id: string
          final_content: Json
          framed_topic: string
          framework_id: string
          ideation_id: string
          seed_topic: string
          specific_topic: string
          workflow_status: string
        }[]
      }
      get_profile_from_auth: {
        Args: never
        Returns: {
          avatar_url: string | null
          company_size: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          industry: string | null
          is_admin: boolean | null
          last_name: string | null
          notification_settings: Json | null
          onboarding_completed: boolean | null
          onboarding_status: string | null
          payment_date: string | null
          payment_status: string | null
          phone: string | null
          plan: string | null
          preferences: Json | null
          role: string | null
          slack_channel_id: string | null
          subscription_end_date: string | null
          subscription_id: string | null
          target_audience: string | null
          updated_at: string | null
          user_id: string
          username: string | null
          whatsapp_phone_number: string | null
          workspace_name: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "agency_admin"
        | "agency_manager"
        | "creator_editor"
        | "client_approver"
        | "client_viewer"
      audit_status:
        | "draft"
        | "internal_review"
        | "final"
        | "converted_to_project"
      content_status:
        | "idea"
        | "planned"
        | "scripting"
        | "recording"
        | "editing"
        | "review"
        | "changes_requested"
        | "approved"
        | "scheduled"
        | "published"
        | "archived"
      content_type_enum:
        | "youtube_video"
        | "youtube_short"
        | "instagram_reel"
        | "instagram_post"
        | "instagram_story"
        | "tiktok"
        | "linkedin_post"
        | "blog"
        | "podcast"
        | "other"
      platform_enum:
        | "youtube"
        | "instagram"
        | "tiktok"
        | "linkedin"
        | "twitter"
        | "blog"
        | "podcast"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "agency_admin",
        "agency_manager",
        "creator_editor",
        "client_approver",
        "client_viewer",
      ],
      audit_status: [
        "draft",
        "internal_review",
        "final",
        "converted_to_project",
      ],
      content_status: [
        "idea",
        "planned",
        "scripting",
        "recording",
        "editing",
        "review",
        "changes_requested",
        "approved",
        "scheduled",
        "published",
        "archived",
      ],
      content_type_enum: [
        "youtube_video",
        "youtube_short",
        "instagram_reel",
        "instagram_post",
        "instagram_story",
        "tiktok",
        "linkedin_post",
        "blog",
        "podcast",
        "other",
      ],
      platform_enum: [
        "youtube",
        "instagram",
        "tiktok",
        "linkedin",
        "twitter",
        "blog",
        "podcast",
        "other",
      ],
    },
  },
} as const
