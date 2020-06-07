import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const saveRecord = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated Error');
  }

  const { scores, date }  = data;
  if (!scores || !date) {
    throw new functions.https.HttpsError('invalid-argument', 'Argument is Invalid');
  }

  try {
    await db.collection('records').add({
      uid: uid,
      scores: scores,
      date: date,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'DB Error', error);
  }
  
  return {
    message: 'success'
  };
});
