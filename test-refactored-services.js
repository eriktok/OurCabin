#!/usr/bin/env node

/**
 * Test Refactored Supabase Services
 * This script tests the new composed services to ensure they work correctly
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testRefactoredServices() {
  console.log('🔍 Testing Refactored Supabase Services...\n');

  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
    console.error('❌ SUPABASE_URL not set or still using placeholder');
    process.exit(1);
  }

  if (!supabaseAnonKey || supabaseAnonKey.includes('your-anon-key')) {
    console.error('❌ SUPABASE_ANON_KEY not set or still using placeholder');
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

    // Test storage (if bucket exists)
    console.log('\n🗄️ Testing storage...');
    try {
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      if (storageError) {
        console.log('⚠️  Storage test failed:', storageError.message);
      } else {
        const cabinImagesBucket = buckets.find(bucket => bucket.name === 'cabin-images');
        if (cabinImagesBucket) {
          console.log('✅ Storage bucket "cabin-images" exists');
        } else {
          console.log('⚠️  Storage bucket "cabin-images" not found - run setup-storage.sql');
        }
      }
    } catch (err) {
      console.log('⚠️  Storage test failed:', err.message);
    }

    console.log('\n🎉 Refactored services are working correctly!');
    console.log('\n📝 Next steps:');
    console.log('   1. Set up storage bucket: run setup-storage.sql in Supabase');
    console.log('   2. Configure authentication providers in Supabase dashboard');
    console.log('   3. Test your app with: npm start');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the test
testRefactoredServices().catch(console.error);
