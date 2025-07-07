"use client";
import React, { useState, useEffect } from 'react';
import { authService } from '@/utils/auth';
import { gigService, skillService, categoryService } from '@/utils/services';

export default function TestIntegration() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [clientInfo, setClientInfo] = useState({
    frontendUrl: 'Loading...',
    authStatus: 'Loading...'
  });

  useEffect(() => {
    // This code runs only on the client, after the component has mounted
    setClientInfo({
      frontendUrl: window.location.origin,
      authStatus: authService.isAuthenticated() ? 'Authenticated' : 'Not authenticated'
    });
  }, []); // Empty dependency array ensures this runs only once

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Check if API is reachable
      console.log('Testing API connectivity...');
      try {
        const skills = await skillService.getAllSkills();
        results.apiConnectivity = {
          status: 'PASS',
          message: `API is reachable. Found ${skills.length} skills.`,
          data: skills.slice(0, 3) // Show first 3 skills
        };
      } catch (error) {
        results.apiConnectivity = {
          status: 'FAIL',
          message: `API connectivity failed: ${error.message}`,
          error: error
        };
      }

      // Test 2: Check categories
      console.log('Testing categories endpoint...');
      try {
        const categories = await categoryService.getAllCategories();
        results.categories = {
          status: 'PASS',
          message: `Categories endpoint working. Found ${categories.length} categories.`,
          data: categories.slice(0, 3)
        };
      } catch (error) {
        results.categories = {
          status: 'FAIL',
          message: `Categories endpoint failed: ${error.message}`,
          error: error
        };
      }

      // Test 3: Check gigs endpoint
      console.log('Testing gigs endpoint...');
      try {
        const gigs = await gigService.getAllGigs();
        results.gigs = {
          status: 'PASS',
          message: `Gigs endpoint working. Found ${gigs.length} gigs.`,
          data: gigs.slice(0, 2)
        };
      } catch (error) {
        results.gigs = {
          status: 'FAIL',
          message: `Gigs endpoint failed: ${error.message}`,
          error: error
        };
      }

      // Test 4: Check authentication status
      console.log('Testing authentication...');
      const isAuth = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      results.authentication = {
        status: isAuth ? 'PASS' : 'INFO',
        message: isAuth ? 'User is authenticated' : 'No user authenticated',
        data: { isAuthenticated: isAuth, currentUser }
      };

    } catch (error) {
      console.error('Test suite error:', error);
      results.general = {
        status: 'ERROR',
        message: `Test suite failed: ${error.message}`,
        error: error
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS': return 'text-green-600';
      case 'FAIL': return 'text-red-600';
      case 'INFO': return 'text-blue-600';
      case 'ERROR': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Django Backend Integration Test
          </h1>
          
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {loading ? 'Running Tests...' : 'Run Integration Tests'}
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(testResults).map(([testName, result]) => (
              <div key={testName} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold capitalize">
                    {testName.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <span className={`font-bold ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{result.message}</p>
                {result.data && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
                {result.error && (
                  <div className="bg-red-50 p-3 rounded text-sm">
                    <p className="text-red-700 font-semibold">Error Details:</p>
                    <pre className="whitespace-pre-wrap text-red-600">
                      {result.error.message || JSON.stringify(result.error, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {Object.keys(testResults).length === 0 && !loading && (
            <div className="text-center text-gray-500 py-8">
              <p>Click "Run Integration Tests" to start testing the Django backend integration.</p>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Environment Info:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
              <p><strong>Frontend URL:</strong> {clientInfo.frontendUrl}</p>
              <p><strong>Authentication:</strong> {clientInfo.authStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 