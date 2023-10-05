import Head from 'next/head'
import dayjs from "dayjs";
import { IconBookmark } from '@/components/Icons';
import Bookmark from '@/components/Bookmark';

function HomePage() {


  return (
    <div className="main">
      <Head>
        <title>Bookmark</title>
      </Head>
      <Bookmark />
    </div>
  );
}

export default HomePage;