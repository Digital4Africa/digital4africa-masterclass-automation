import cron from 'node-cron';
import Cohort from '../models/cohort.model.js';
import {
  sendOneWeekReminderEmail,
  sendTwoDayReminderEmail,
  sendDayOfReminderEmail,
  sendSecondDayReminderEmail
} from './sendReminderEmails.js';

export const startEmailScheduler = () => {
  console.log('📅 Email scheduler started');

  cron.schedule('0 6 * * *', async () => {
    console.log('🔄 Daily email check running at:', new Date());

    await checkAndSendReminders(7, 'oneWeekReminderSent', sendOneWeekReminderEmail);
    await checkAndSendReminders(2, 'twoDayReminderSent', sendTwoDayReminderEmail);
    await checkAndSendReminders(0, 'dayOfReminderSent', sendDayOfReminderEmail);
    await checkSecondDayReminders();
  });
};

const checkAndSendReminders = async (daysBefore, sentFlag, emailSender) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysBefore);

    const cohorts = await Cohort.find({
      startDate: {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    console.log(`Found ${cohorts.length} cohorts starting in ${daysBefore} days`);

    for (const cohort of cohorts) {
      await sendRemindersForCohort(cohort, sentFlag, emailSender);
    }
  } catch (error) {
    console.error(`Error in checkAndSend${daysBefore}DayReminders:`, error);
  }
};

const checkSecondDayReminders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const cohorts = await Cohort.find({
      startDate: {
        $lt: today,
        $gte: yesterday
      },
      endDate: {
        $gte: today
      }
    });

    console.log(`Found ${cohorts.length} potential second-day cohorts`);

    for (const cohort of cohorts) {
      const needsReminder = cohort.students.some(student => {
        const notification = cohort.emailNotifications.find(n => n.email === student.email);
        return !notification || !notification.secondDayReminderSent;
      });

      if (needsReminder) {
        console.log(`Processing cohort ${cohort._id} for second-day reminders`);
        await sendRemindersForCohort(cohort, 'secondDayReminderSent', sendSecondDayReminderEmail);
      } else {
        console.log(`Cohort ${cohort._id} already had second-day reminders sent`);
      }
    }
  } catch (error) {
    console.error('Error in checkSecondDayReminders:', error);
  }
};

const sendRemindersForCohort = async (cohort, sentFlag, emailSender) => {
  for (const student of cohort.students) {
    let notification = cohort.emailNotifications.find(n => n.email === student.email);

    if (!notification || !notification[sentFlag]) {
      await emailSender({
        fullName: student.fullName,
        email: student.email,
        cohortName: cohort.masterclassTitle,
        startDate: cohort.startDate,
      });

      if (notification) {
        notification[sentFlag] = true;
      } else {
        notification = {
          email: student.email,
          [sentFlag]: true
        };
        cohort.emailNotifications.push(notification);
      }

      await cohort.save();
    }
  }
};