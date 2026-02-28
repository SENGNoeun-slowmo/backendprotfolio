const { supabaseAdmin } = require('./src/config/supabase');

async function listProfiles() {
  try {
    const { data, error } = await supabaseAdmin.from('profiles').select('*');
    if (error) throw error;
    console.log('Profiles:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

listProfiles();
