'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

function QyeryProvider({ children }) {
    const quericlient = new QueryClient();
    return (
        <QueryClientProvider client={quericlient}>
            {children}
        </QueryClientProvider>
    )
}

export default QyeryProvider