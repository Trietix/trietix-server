import cron from 'node-cron';
import { eventModel } from '../event';

const updateEvent = () => {
    console.log('Started Cron Job')
    const job = cron.schedule(' */1 * * * *', async()=>{
        const currentTime = new Date().toISOString().slice(11, 16);
        const currentDate = new Date().toISOString().slice(0, 10);
        let eventsStarted = 0;
        let eventsEnded = 0;

        const eventsToStart = await eventModel.find({
            startTime: { $lte: currentTime },
            date: { $gte: currentDate },
            isStarted: false,
        })

        eventsToStart.forEach(async (event)=>{
            event.isStarted = true;
            eventsStarted++;
            await event.save();
        });

        console.log(`Started ${eventsStarted} events`)
        
        const eventsToEnd = await eventModel.find({
            endTime: { $gte: currentTime },
            date: { $lte: currentDate },
            isStarted: true,
            isEnded: false
        });
        
        eventsToEnd.forEach( async(event)=>{
            event.isEnded = true;
            eventsEnded++;
            await event.save();
        });

        console.log(`Ended ${eventsEnded} events`)
    },{
        scheduled: true,
        timezone: 'Africa/Lagos'
    });
    job.start();
};

export { updateEvent }