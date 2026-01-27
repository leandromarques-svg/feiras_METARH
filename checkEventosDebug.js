import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cnwxpqttflndiuqymtmw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNud3hwcXR0ZmxuZGl1cXltdG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTUzMzMsImV4cCI6MjA3OTM5MTMzM30.-p59cN_rT2e7c5evmFX6-pdOpRBHJKhlrfF7V8947hk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEventos() {
    console.log('Checking "eventos" table...');
    try {
        const { data, error } = await supabase.from('eventos').select('*').limit(1);

        if (error) {
            console.error('Error querying "eventos" table:');
            console.error(JSON.stringify(error, null, 2));
        } else {
            console.log('Success! Table "eventos" exists.');
            console.log('Data sample:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkEventos();
