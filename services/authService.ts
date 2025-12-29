import {User} from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';
import App from 'next/app';

export type AppRole='admin'|'pms'|'creator'|'client';
export interface UserRole{
    userId:string;
    role:AppRole;
    created_at:string;
}

export interface AuthSession{
    user:User;
    roles:AppRole[];
}

export class AuthService{

    static async getUserRoles(supabase:SupabaseClient,userId:string):Promise<AppRole[]>{
        try{
            const {data,error}=await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id',userId);

            if(error){
                console.error('Error fetching user roles:',error);
                throw error;
            }
            return (data||[]).map((r) => r.role as AppRole);
        } catch (error) {
            console.error('Failed to fetch user roles:', error);
            return [];
        }
    }

    static hasRole(roles:AppRole[],role:AppRole):boolean{
        return roles.includes(role);
    }

    static hasAnyRole(roles:AppRole[],allowedRoles:AppRole[]):boolean{
        return allowedRoles.some((role) => roles.includes(role));
    }

    static async getCurrentSession(supabase:SupabaseClient):Promise<AuthSession|null>{
        try{
            const {data:{session},error}=await supabase.auth.getSession();
            if(error||!session){
                return null;
            }
            const roles=await this.getUserRoles(supabase,session.user.id);
            return {
                user:session.user,
                roles,
            };
        } catch (error) {
            console.error('Failed to get current session:', error);
            return null;
        }
    }

    static async signOut(supabase:SupabaseClient):Promise<void>{
        const {error}=await supabase.auth.signOut();
        if(error){
            console.error('Error signing out:',error);
            throw error;
        }
    }

    static async signIn(supabase:SupabaseClient,email:string,password:string):Promise<AuthSession>{
        const {data,error}=await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if(error||!data.user){
            throw error || new Error('Authentication failed');
        }
        const roles=await this.getUserRoles(supabase,data.user.id);
        return {
            user:data.user,
            roles,
        };
    }

    static async signUp(supabase:SupabaseClient,email:string,password:string,metadata?:Record<string,any>){
        const {data,error}=await supabase.auth.signUp({
            email,
            password,
            options:{
                data:metadata,
            },
        });
        if(error){
            throw error;
        }
        return data;
    }
}