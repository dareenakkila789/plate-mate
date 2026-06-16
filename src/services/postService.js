import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const fetchPosts = async () => {
  const postsCollectionRef = collection(db, 'posts');
  const data = await getDocs(postsCollectionRef);
  return data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};