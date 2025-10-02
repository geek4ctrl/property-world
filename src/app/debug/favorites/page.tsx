'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function FavoritesDebugPage() {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [testResults, setTestResults] = useState<any[]>([]);

  const addDebugLine = (message: string) => {
    setDebugInfo(prev => prev + '\n' + new Date().toLocaleTimeString() + ': ' + message);
    console.log('DEBUG:', message);
  };

  const testSupabaseConnection = async () => {
    addDebugLine('Testing Supabase connection...');
    
    try {
      // Test basic connection
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
      if (error) {
        addDebugLine(`❌ Supabase connection failed: ${error.message}`);
      } else {
        addDebugLine('✅ Supabase connection successful');
      }
    } catch (err: any) {
      addDebugLine(`❌ Connection error: ${err.message}`);
    }
  };

  const testAuthentication = async () => {
    addDebugLine('Testing authentication...');
    
    if (!user) {
      addDebugLine('❌ No user logged in');
      return;
    }

    addDebugLine(`✅ User logged in: ${user.email}`);
    addDebugLine(`User ID: ${user.id}`);
    
    // Test user session
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      addDebugLine('✅ Valid session found');
    } else {
      addDebugLine('❌ No valid session');
    }
  };

  const testTableExists = async () => {
    addDebugLine('Testing if user_favorites table exists...');
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .limit(1);
        
      if (error) {
        if (error.message.includes('does not exist')) {
          addDebugLine('❌ user_favorites table does not exist');
          addDebugLine('Please run the migration script from SUPABASE_SETUP.md');
        } else {
          addDebugLine(`❌ Table access error: ${error.message}`);
        }
      } else {
        addDebugLine('✅ user_favorites table exists and is accessible');
      }
    } catch (err: any) {
      addDebugLine(`❌ Table test error: ${err.message}`);
    }
  };

  const testAddFavorite = async () => {
    if (!user) {
      addDebugLine('❌ Cannot test add favorite - not logged in');
      return;
    }

    const testPropertyId = 'test-property-123';
    addDebugLine(`Testing add favorite for property: ${testPropertyId}`);
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert([{ 
          user_id: user.id, 
          property_id: testPropertyId 
        }])
        .select();

      if (error) {
        addDebugLine(`❌ Add favorite failed: ${error.message}`);
        addDebugLine(`Error details: ${JSON.stringify(error, null, 2)}`);
      } else {
        addDebugLine('✅ Add favorite successful');
        addDebugLine(`Added data: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err: any) {
      addDebugLine(`❌ Add favorite error: ${err.message}`);
    }
  };

  const testFetchFavorites = async () => {
    if (!user) {
      addDebugLine('❌ Cannot test fetch favorites - not logged in');
      return;
    }

    addDebugLine('Testing fetch favorites...');
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        addDebugLine(`❌ Fetch favorites failed: ${error.message}`);
      } else {
        addDebugLine(`✅ Fetch favorites successful. Found ${data.length} favorites`);
        addDebugLine(`Favorites data: ${JSON.stringify(data, null, 2)}`);
        setTestResults(data);
      }
    } catch (err: any) {
      addDebugLine(`❌ Fetch favorites error: ${err.message}`);
    }
  };

  const runAllTests = async () => {
    setDebugInfo('Starting comprehensive debug tests...\n');
    setTestResults([]);
    
    await testSupabaseConnection();
    await testAuthentication();
    await testTableExists();
    await testAddFavorite();
    await testFetchFavorites();
    
    addDebugLine('\n=== Debug tests completed ===');
  };

  const clearTests = () => {
    setDebugInfo('');
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Favorites Debug Console</h1>
          
          {/* User Status */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-blue-900 mb-2">Authentication Status</h2>
            {user ? (
              <div className="text-sm text-blue-800">
                <p>✅ Logged in as: {user.email}</p>
                <p>User ID: {user.id}</p>
              </div>
            ) : (
              <p className="text-red-600">❌ Not logged in</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mb-6 space-x-4">
            <button
              onClick={runAllTests}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Run All Tests
            </button>
            <button
              onClick={clearTests}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear Results
            </button>
          </div>

          {/* Debug Output */}
          {debugInfo && (
            <div className="mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">Debug Output</h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-auto max-h-96 whitespace-pre-wrap font-mono">
                {debugInfo}
              </pre>
            </div>
          )}

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">Current Favorites Data</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Debug Instructions</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>1. Make sure you're logged in first</li>
              <li>2. Click "Run All Tests" to check all components</li>
              <li>3. Look for any ❌ errors in the debug output</li>
              <li>4. If table doesn't exist, run the migration from SUPABASE_SETUP.md</li>
              <li>5. Check browser console for additional errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}