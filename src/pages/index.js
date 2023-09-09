import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [bookmarks, setBookmarks] = useState([])
  const inputRef = useRef();

  const fetchMetadata = async () => {
    if (!url) return;
    setLoading(true)

    try {
      const response = await fetch(`/api/get_meta_data?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }

      const data = await response.json();

      if (data) {
        setMetadata(data);
        data.id = Math.random()
        setBookmarks(oldArray => [data, ...oldArray]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
      setUrl('')
      setTimeout(function(){
        inputRef.current.focus();
      }, 20)
    }
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchMetadata()

      return
    }

    const filtering = bookmarks.filter((mark) => mark.title.includes(url))
    console.log(filtering)
  };

  return (
    <div className="main">
      <h3>Bookmarks</h3>
      <div className='bookmark-bar'>
        <div className='bookmark-icon'>
          { loading && (
            <div className='loader'>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          { !loading && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className='main-input'
          onKeyDown={handleEnterKeyPress}
          disabled={loading}
        />
      </div>

      {bookmarks.length >= 1 && (
        <div className='list-header'>
          <p>Title</p>
          <p>Date</p>
        </div>
      )}

      <div className='lists'>
        <AnimatePresence>
          {bookmarks.length && bookmarks.map((item) => (
            <motion.div
              initial={{ opacity: 0 , y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ stiffness: 900, damping: 40 }}
              className='item-list'
              key={item.id}
            >
              {/* <img src={item.faviconUrl.includes('http') ? item.faviconUrl : (item.url + item.faviconUrl)} alt="Website Thumbnail" height="16px" /> */}
              <img src={`https://www.google.com/s2/favicons?domain=${item.url}&sz=${128}`} alt="Website Thumbnail" height="16px" />
              <p className='item-title'>{item.title}</p>
              <span className='line' />
              <small>{item.url.replace(/^https:\/\//, '')}</small>
              <span className='date'>Sept 9, 2023</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HomePage;