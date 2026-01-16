/**
 * Base Service Class
 * Provides common CRUD operations and error handling
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';

export class BaseService {
  /**
   * Handle Supabase errors consistently
   */
  protected static handleError(error: unknown, context: string): never {
    console.error(`[${context}] Error:`, error);
    throw error;
  }

  /**
   * Wrap result in ApiResponse format
   */
  protected static success<T>(data: T): ApiResponse<T> {
    return { data, error: null, success: true };
  }

  /**
   * Wrap error in ApiResponse format
   */
  protected static failure<T>(error: string): ApiResponse<T> {
    return { data: null, error, success: false };
  }

  /**
   * Build paginated response
   */
  protected static paginate<T>(
    data: T[],
    total: number,
    params: PaginationParams
  ): PaginatedResponse<T> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Apply pagination to query
   */
  protected static applyPagination(
    query: any,
    params: PaginationParams
  ): any {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    return query.range(from, to);
  }

  /**
   * Apply sorting to query
   */
  protected static applySorting(
    query: any,
    params: PaginationParams,
    defaultSort: string = 'created_at',
    defaultOrder: 'asc' | 'desc' = 'desc'
  ): any {
    const sortBy = params.sortBy || defaultSort;
    const sortOrder = params.sortOrder || defaultOrder;

    return query.order(sortBy, { ascending: sortOrder === 'asc' });
  }
}
