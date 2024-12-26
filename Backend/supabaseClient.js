const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://svtjwxsxfvhqoaucfsmj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dGp3eHN4ZnZocW9hdWNmc21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMzkwMDAsImV4cCI6MjA0OTYxNTAwMH0.-ZRnlQwqCzVIWgSB-plAZEhM-PVt9WOGFJkalDH0G84'; // Found in your Supabase dashboard
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
