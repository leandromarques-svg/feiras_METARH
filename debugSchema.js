import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cnwxpqttflndiuqymtmw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNud3hwcXR0ZmxuZGl1cXltdG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTUzMzMsImV4cCI6MjA3OTM5MTMzM30.-p59cN_rT2e7c5evmFX6-pdOpRBHJKhlrfF7V8947hk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSchema() {
    console.log("Testing 'participantes' insert with area...");
    try {
        const { data: pData, error: pError } = await supabase
            .from('participantes')
            .insert([{ nome: "Teste Area", area: "Comercial" }])
            .select();

        if (pError) {
            console.error("Participantes Insert Error:", pError.message, pError.details);
        } else {
            console.log("Participantes Insert Success:", pData);
            // Clean up
            await supabase.from('participantes').delete().eq('id', pData[0].id);
        }
    } catch (e) {
        console.error("Participantes Exception:", e);
    }

    console.log("\nTesting 'eventos' update with object structure...");
    try {
        // Get first event
        const { data: events } = await supabase.from('eventos').select('*').limit(1);
        if (!events || events.length === 0) {
            console.log("No events found to test.");
            return;
        }
        const event = events[0];
        const newInteressados = [...(event.interessados || []), { nome: "Teste Intencao", intencao: "Prospecção" }];

        const { error: eError } = await supabase
            .from('eventos')
            .update({ interessados: newInteressados })
            .eq('id', event.id);

        if (eError) {
            console.error("Eventos Update Error:", eError.message, eError.details);
        } else {
            console.log("Eventos Update Success!");
            // Revert is tricky without knowing original, effectively we just added test data.
            // Ideally we revert immediately.
            const originalInteressados = event.interessados;
            await supabase.from('eventos').update({ interessados: originalInteressados }).eq('id', event.id);
        }
    } catch (e) {
        console.error("Eventos Exception:", e);
    }
}

testSchema();
