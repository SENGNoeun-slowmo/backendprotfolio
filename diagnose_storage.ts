import { supabaseAdmin } from './src/config/supabase';

async function diagnoseStorage() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    console.log('BUCKETS_NAMES:', buckets?.map(b => b.name));

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, avatar_url, role')
      .eq('role', 'admin')
      .single();
    console.log('ADMIN_AVATAR:', profile?.avatar_url);

  } catch (err: any) {
    console.error('DIAG_ERROR:', err.message);
  }
}

diagnoseStorage();
