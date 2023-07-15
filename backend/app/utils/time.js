import moment from 'moment';
import 'moment-timezone';
import admin from 'firebase-admin';

const dateTimeNow = () => {
  const timestamp = admin.firestore.Timestamp.now();
  const date = timestamp.toDate();
  const formattedTimestamp = moment(date)
    .tz('Asia/Makassar')
    .format('YYYY-MM-DD HH:mm:ss');
  return formattedTimestamp;
};

const formatDateTime = async (dateTime) => {
  const time = moment(dateTime)
    .tz('Asia/Makassar')
    .format('YYYY-MM-DD HH:mm:ss');
  return time;
};

export { formatDateTime, dateTimeNow };
