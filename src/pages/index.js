import Head from 'next/head'
import dayjs from "dayjs";
import { IconBookmark } from '@/components/Icons';
import Link from 'next/link';

function HomePage() {


  return (
    <div className="main">
      <Head>
        <title>Bookmark</title>
      </Head>
      <div className='card'>
        <div className='card-header'>
          <IconBookmark />
          <h3>Bookmark</h3>
        </div>
        <div className='card-line'>
          <small style={{color: '#999', marginBottom: '.5em', display: 'block'}}>About</small>
          <p>Built for personal usage, designed with personal preferences. Bare-featured, minimal boring interface. Auto-detect input content type. Render links with page metadata. Keyboard-first design. Animated appropriately. No onboarding. No tracking. No ads, ever.</p>
        </div>
        <div className='card-line'>
          <small style={{color: '#999', marginBottom: '.5em', display: 'block'}}>About</small>
          <p>Built for personal usage, designed with personal preferences. Bare-featured, minimal boring interface. Auto-detect input content type. Render links with page metadata. Keyboard-first design. Animated appropriately. No onboarding. No tracking. No ads, ever.</p>
        </div>
        <Link href="/bookmarks">Continue</Link>
      </div>
    </div>
  );
}

export default HomePage;