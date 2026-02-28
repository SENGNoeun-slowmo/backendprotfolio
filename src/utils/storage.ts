import { supabaseAdmin } from '../config/supabase';

/**
 * Upload a file to Supabase Storage and return the public URL
 */
export const uploadToSupabase = async (
  bucket: string,
  path: string,
  file: Express.Multer.File
): Promise<string> => {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) {
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFromSupabase = async (bucket: string, path: string) => {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`Failed to delete from Supabase: ${error.message}`);
  }
};
