import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import toast from 'react-hot-toast'; // Replace with your toast library if different

// Expected structure of your API response
interface ApiResponse<T = any> {
  success?: boolean;
  message?: string; // The message from your backend (e.g., "Candidate created successfully")
  devMsg?: string;
  userMsg?: Record<string, string[]>;
  data?: T;
}

interface UseApiFormOptions<TResponse> {
  showToast?: boolean;                     // Default is true
  defaultSuccessMsg?: string;              // Fallback if API doesn't send a message
  defaultErrorMsg?: string;                // Fallback if API doesn't send an error
  onSuccess?: (data: TResponse) => void;   // Triggered on 200 OK
  onError?: (error: any) => void;          // Triggered on failure
}

export const useApiForm = <TResponse = ApiResponse>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET' = 'POST',
  options?: UseApiFormOptions<TResponse>
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TResponse | null>(null);

  // Destructure options with defaults
  const { 
    showToast = true, 
    defaultSuccessMsg = 'Success!', 
    defaultErrorMsg = 'Something went wrong.',
    onSuccess,
    onError
  } = options || {};

  const execute = useCallback(
    async (payload?: any, config?: AxiosRequestConfig): Promise<TResponse | null> => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios({
          url,
          method,
          data: payload,
          ...config,
        });
        
        const responseData = response.data;
        setData(responseData);

        // --- Handle Success Toast ---
        if (showToast) {
          // Look for a message from the API, otherwise use the default
          const toastMsg = responseData?.message || responseData?.devMsg || defaultSuccessMsg;
          toast.success(toastMsg);
        }

        // Trigger custom success callback (e.g., to close a modal or refresh a list)
        if (onSuccess) onSuccess(responseData);

        return responseData;

      } catch (err) {
        const axiosError = err as AxiosError<ApiResponse>;
        
        // --- Handle Error Extraction ---
        const errorData = axiosError.response?.data;
        const errorMessage = 
          errorData?.message || 
          errorData?.devMsg || 
          axiosError.message || 
          defaultErrorMsg;
          
        setError(errorMessage);

        // --- Handle Error Toast ---
        if (showToast) {
          toast.error(errorMessage);
        }

        // Trigger custom error callback
        if (onError) onError(axiosError);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [url, method, showToast, defaultSuccessMsg, defaultErrorMsg, onSuccess, onError]
  );

  // Instantly wipe all states back to default
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { execute, isLoading, error, data, reset };
};