import cron from 'node-cron';
import { eventModel } from '../event';

const updateEvent = () => {
    console.log('Started Cron Job');
    const job = cron.schedule('*/1 * * * *', async () => {
        const now = new Date().toISOString();
        let timeGMT1 = new Date(now);
        timeGMT1.setHours(timeGMT1.getHours() + 1);
        const currentTime = timeGMT1.toISOString().slice(11, 16)
        const currentDate = timeGMT1.toISOString().slice(0, 10)

        let eventsStarted = 0;
        let eventsEnded = 0;

        const eventsToStart = await eventModel.find({
            date: { $gte: currentDate },
            startTime: { $gte: currentTime },
            isStarted: false,
        });

        for (const event of eventsToStart) {
            event.isStarted = true;
            eventsStarted++;
            await event.save();
        }

        console.log(`Started ${eventsStarted} events`);
        console.log(`Time-${currentTime}`)
        console.log(`Date-${currentDate}`)

        // const eventsToEnd = await eventModel.find({
        //     endTime: { $gte: currentTime },
        //     date: { $gte: currentDate },
        //     isStarted: true,
        //     isEnded: false,
        // });

        // for (const event of eventsToEnd) {
        //     event.isEnded = true;
        //     eventsEnded++;
        //     await event.save();
        // }

        // console.log(`Ended ${eventsEnded} events`);
    }, {
        scheduled: true,
        timezone: 'Africa/Lagos',
    });

    job.start();
};

export { updateEvent };