import db from '../config/firebase.config.js';
import { badResponse } from '../utils/response.js';

// Verify Renter
const verifyUser = async (username, uid) => {
  try {
    // Check Renter
    const userSnapshot = await db
      .collection('users')
      .where('username', '==', username)
      .get();

    if (userSnapshot.empty) {
      return {
        errorRenter: true,
        statusRenter: 404,
        checkResponseRenter: badResponse(404, 'User not found'),
      };
    }

    const renterData = userSnapshot.docs[0].data();

    const renterRef = userSnapshot.docs[0].ref;

    // Check Auth Token
    if (renterData.renter_id !== uid) {
      return {
        errorRenter: true,
        statusRenter: 403,
        checkResponseRenter: badResponse(403, 'Not allowed'),
      };
    }

    return {
      errorRenter: false,
      renterData,
      renterRef,
    };
  } catch (error) {
    console.error('Error while checking username and UID:', error);
    return {
      errorUser: true,
      statusRenter: 500,
      checkResponseRenter: badResponse(
        500,
        'An error occurred while checking username and UID'
      ),
    };
  }
};

// Check UID
const checkUID = async (collection, id, uid) => {
  const snapshot = await db.collection(`${collection}`).doc(id).get();

  const snapshotData = snapshot.data();

  if (snapshotData.renter_id !== uid) {
    return {
      errorUID: true,
      statusUID: 403,
      checkResponseUID: badResponse(403, 'Not allowed'),
    };
  }
  return {
    errorUID: false,
    snapshotData,
  };
};

export { verifyUser, checkUID };
