#!/usr/bin/env node

/**
 * Test Supabase Connection Script
 * This script tests your Supabase configuration and connection
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
    console.error('❌ SUPABASE_URL not set or still using placeholder');
    console.log('   Please update your .env file with your actual Supabase URL');
    process.exit(1);
  }

  if (!supabaseAnonKey || supabaseAnonKey.includes('your-anon-key')) {
    console.error('❌ SUPABASE_ANON_KEY not set or still using placeholder');
    console.log('   Please update your .env file with your actual Supabase anon key');
    process.exit(1);
  }

  console.log('✅ Environment variables configured');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...`);

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Test basic connection
    console.log('\n🔌 Testing basic connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.log('\n💡 Troubleshooting tips:');
      console.log('   1. Check your SUPABASE_URL and SUPABASE_ANON_KEY');
      console.log('   2. Make sure your database schema is set up (run database-setup.sql)');
      console.log('   3. Verify your Supabase project is active');
      process.exit(1);
    }

    console.log('✅ Basic connection successful');

    // Test table access
    console.log('\n📊 Testing table access...');
    const tables = ['users', 'cabins', 'posts', 'tasks', 'bookings', 'comments'];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase.from(table).select('*').limit(1);
        if (tableError) {
          console.log(`⚠️  Table '${table}' not accessible: ${tableError.message}`);
        } else {
          console.log(`✅ Table '${table}' accessible`);
        }
      } catch (err) {
        console.log(`❌ Error accessing table '${table}': ${err.message}`);
      }
    }

    // Test authentication
    console.log('\n🔐 Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️  Authentication test failed:', authError.message);
    } else {
      console.log('✅ Authentication service accessible');
    }

    console.log('\n🎉 Supabase setup is working correctly!');
    console.log('\n📝 Next steps:');
    console.log('   1. Set up authentication providers in your Supabase dashboard');
    console.log('   2. Configure your app\'s authentication flow');
    console.log('   3. Test your app with: npm start');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the test
testSupabaseConnection().catch(console.error);
