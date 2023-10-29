import cron from 'node-cron';
import { eventModel } from '../event';

const updateEvent = async () => {
    cron.schedule('* 1 * * *');
    // Find events with a start date greater than or equal to 24 hours ago
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const eventsToUpdate = await eventModel.find({ startDate: { $gte: twentyFourHoursAgo } });

    // Update the events with started=true
    for (const event of eventsToUpdate) {
        event.started = true;
        await event.save();
    }

    console.log(`Updated ${eventsToUpdate.length} events.`);
}

export { updateEvent }