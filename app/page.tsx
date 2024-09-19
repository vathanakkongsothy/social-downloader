"use client"
import Layout from "@/components/Layout";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  )
}