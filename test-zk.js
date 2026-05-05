const ZKLib = require('node-zk-ahris');

async function test24HoursRaw() {
    const ip = '192.168.5.11';
    const port = 4370;

    console.log(`[START] Fetching last 24h raw data from ${ip}...`);
    const zk = new ZKLib(ip, port, 10000, 4000);

    try {
        await zk.createSocket();
        
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        const logs = await zk.getAttendances();
        
        const filtered = logs.data.filter(l => {
            const logDate = new Date(l.recordTime);
            return logDate >= twentyFourHoursAgo && logDate <= now;
        });

        console.log('--- RAW FILTERED DATA ---');
        console.dir(filtered, { depth: null }); 
        console.log('-------------------------');
        console.log(`Total: ${filtered.length} records.`);

    } catch (err) {
        console.error('[FAILED]', err);
    } finally {
        try { await zk.disconnect(); } catch (e) {}
        process.exit(0);
    }
}

test24HoursRaw();
