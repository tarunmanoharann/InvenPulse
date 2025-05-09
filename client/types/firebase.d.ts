declare module 'firebase/app' {
  import firebase from 'firebase/app';
  export default firebase;
}

declare module 'firebase/auth' {
  export * from '@firebase/auth-types';
}

declare module 'firebase/firestore' {
  export * from '@firebase/firestore-types';
}

declare module 'firebase/analytics' {
  export * from '@firebase/analytics-types';
} 