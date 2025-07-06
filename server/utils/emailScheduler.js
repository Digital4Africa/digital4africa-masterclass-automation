import cron from 'node-cron';
import Cohort from '../models/cohort.model.js';
import {
  sendOneWeekReminderEmail,
  sendTwoDayReminderEmail,
  sendDayOfReminderEmail,
  sendLastDayReminderEmail
} from './sendReminderEmails.js';

export const startEmailScheduler = () => {
  console.log('📅 Email scheduler started');

  cron.schedule('0 6 * * *', async () => {
    console.log('🔄 Daily email check running at:', new Date());

    await checkAndSendReminders(7, 'oneWeekReminderSent', sendOneWeekReminderEmail);
    await checkAndSendReminders(2, 'twoDayReminderSent', sendTwoDayReminderEmail);
    await checkAndSendReminders(0, 'dayOfReminderSent', sendDayOfReminderEmail);
    await checkLastDayReminders();
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

const checkLastDayReminders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cohorts = await Cohort.find({
      endDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    console.log(`Found ${cohorts.length} cohorts ending today`);

    for (const cohort of cohorts) {
      const needsReminder = cohort.students.some(student => {
        const notification = cohort.emailNotifications.find(n => n.email === student.email);
        return !notification || !notification.lastDayReminderSent;
      });

      if (needsReminder) {
        console.log(`Processing cohort ${cohort._id} for last-day reminders`);
        await sendRemindersForCohort(cohort, 'lastDayReminderSent', sendLastDayReminderEmail);
      } else {
        console.log(`Cohort ${cohort._id} already had last-day reminders sent`);
      }
    }
  } catch (error) {
    console.error('Error in checkLastDayReminders:', error);
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
        startTime: cohort.startTime,
        endTime: cohort.endTime,
        additionalEmailContent: cohort.additionalEmailContent,
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