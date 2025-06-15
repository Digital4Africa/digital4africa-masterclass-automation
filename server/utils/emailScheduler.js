import cron from 'node-cron';
import Cohort from '../models/cohort.model.js';
import {
  sendOneWeekReminderEmail,
  sendTwoDayReminderEmail,
  sendDayOfReminderEmail
} from './sendReminderEmails.js';

export const startEmailScheduler = () => {
  console.log('📅 Email scheduler started');

  // Runs daily at 6:00 AM
  cron.schedule('0 6 * * *', async () => {
    console.log('🔄 Daily email check running at:', new Date());

    // Check and send all types of reminders
    await checkAndSendReminders(7, 'oneWeekReminderSent', sendOneWeekReminderEmail);
    await checkAndSendReminders(2, 'twoDayReminderSent', sendTwoDayReminderEmail);
    await checkAndSendReminders(0, 'dayOfReminderSent', sendDayOfReminderEmail);
  });
};

const checkAndSendReminders = async (daysBefore, sentFlag, emailSender) => {
    try {
      const today = new Date();
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + daysBefore);

      const startOfTargetDate = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfTargetDate = new Date(startOfTargetDate.getTime() + 24 * 60 * 60 * 1000);

      const cohorts = await Cohort.find({
        startDate: {
          $gte: startOfTargetDate,
          $lt: endOfTargetDate,
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


const sendRemindersForCohort = async (cohort, sentFlag, emailSender) => {
  for (const student of cohort.students) {
    const notification = cohort.emailNotifications.find(n => n.email === student.email);

    if (!notification || !notification[sentFlag]) {
      // Send the email
      await emailSender({
        fullName: student.fullName,
        email: student.email,
        cohortName: cohort.masterclassTitle,
        startDate: cohort.startDate,
      });

      // Mark as sent
      if (notification) {
        notification[sentFlag] = true;
      } else {
        cohort.emailNotifications.push({
          email: student.email,
          [sentFlag]: true,
        });
      }
    }
  }

  // Save the cohort
  await cohort.save();
};