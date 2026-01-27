import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cnwxpqttflndiuqymtmw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNud3hwcXR0ZmxuZGl1cXltdG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTUzMzMsImV4cCI6MjA3OTM5MTMzM30.-p59cN_rT2e7c5evmFX6-pdOpRBHJKhlrfF7V8947hk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log('Testing insert...');

    const testEvent = {
        id: Date.now().toString(), // replicating app logic
        nome: 'Evento Teste Script',
        sobre: 'Teste de inserção via script',
        segmento: 'Teste',
        local: 'Local Teste',
        site: 'https://exemplo.com',
        mes: '1 - janeiro',
        dia: '01',
        ano: '2026',
        interessados: []
    };

    try {
        const { data, error } = await supabase.from('eventos').insert([testEvent]).select();

        if (error) {
            console.error('Insert failed!');
            console.error('Code:', error.code);
            console.error('Message:', error.message);
            console.error('Details:', error.details);
            console.error('Hint:', error.hint);
        } else {
            console.log('Insert successful!');
            console.log('Inserted Data:', data);

            // Cleanup
            console.log('Cleaning up...');
            await supabase.from('eventos').delete().eq('id', testEvent.id);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testInsert();
