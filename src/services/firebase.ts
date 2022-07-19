import { db } from '../firebase';

export interface IChatData {
  id: string;
  userName: string;
  body: string;
  createdAt: string | number;
}

const Firebase = {
  getMessages(setList: (data: IChatData[]) => void) {
    return db.collection('messages').orderBy('createdAt').onSnapshot(snapshot => {
      const list: IChatData[] = [];

      snapshot.forEach(doc => {
        const data = doc.data() as IChatData;
        data.id = Math.random().toString(36).substring(2);

        // @ts-expect-error Type
        const date = new Date(data.createdAt.seconds * 1000);
        data.createdAt = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

        list.push(data);
      })

      setList([...list]);
    });
  },

  async addMessage(userName: string, body: string) {
    await db.collection('messages').add({
      userName,
      body,
      createdAt: new Date(),
    });
  }
}

export { Firebase }