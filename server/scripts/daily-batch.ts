import { BatchProcessor } from '../services/batch-processor';

async function main() {
    console.log('Starting daily batch job...');
    const processor = new BatchProcessor();
    await processor.processDailyBatch();
    console.log('Daily batch job finished.');
}

main().catch((error) => {
    console.error('Fatal error in daily batch job:', error);
    process.exit(1);
});
