// Test script to check for errors in the app
import { EVENTOS_DATA } from './constants.js';

console.log("Testing EVENTOS_DATA structure...");

try {
    // Check if all events have the correct structure
    EVENTOS_DATA.forEach((evento, index) => {
        console.log(`\nEvent ${index + 1}: ${evento.nome}`);

        // Check interessados structure
        if (evento.interessados && evento.interessados.length > 0) {
            evento.interessados.forEach((interessado, i) => {
                if (typeof interessado === 'string') {
                    console.error(`  ❌ ERROR: interessado ${i} is a string, should be object:`, interessado);
                } else if (!interessado.nome || !interessado.intencao) {
                    console.error(`  ❌ ERROR: interessado ${i} missing nome or intencao:`, interessado);
                } else {
                    console.log(`  ✓ ${interessado.nome} - ${interessado.intencao}`);
                }
            });
        } else {
            console.log(`  (No interessados)`);
        }
    });

    console.log("\n✅ All events checked!");
} catch (error) {
    console.error("❌ Error during test:", error);
}
