import * as HoverCard from '@radix-ui/react-hover-card';

import { motion, AnimatePresence } from 'framer-motion';

function BookmarkItem({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0 , y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ stiffness: 900, damping: 40 }}
      className='item-list'
      key={item.id}
    >
      {/* <img src={item.faviconUrl.includes('http') ? item.faviconUrl : (item.url + item.faviconUrl)} alt="Website Thumbnail" height="16px" /> */}
      <div className='item-favicon'>
        { item.originUrl !== '' ?
          <img src={`https://www.google.com/s2/favicons?domain=${item.originUrl}&sz=${128}`} alt="Website Thumbnail" height="16px" width="16px" />
          :
          <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.68675 15.6451L4.59494 14.5435C4.6983 14.4839 4.8196 14.4631 4.9369 14.4851L8.6914 15.1878C8.99995 15.2455 9.28478 15.008 9.28338 14.6941L9.26876 11.4045C9.26836 11.3151 9.29193 11.2272 9.33701 11.15L11.2317 7.90621C11.3303 7.73739 11.3215 7.52658 11.2091 7.3666L8.01892 2.82568M19.0002 4.85905C13.5002 7.50004 16.5 11 17.5002 11.5C19.3773 12.4384 21.9876 12.5 21.9876 12.5C21.9958 12.3344 22 12.1677 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.1677 22 12.3344 21.9959 12.5 21.9877M16.7578 21.9398L13.591 13.591L21.9398 16.7578L18.2376 18.2376L16.7578 21.9398Z" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      </div>
      { item.title !== '' ?
        <p className='item-title'>{item.title}</p>
        :
        <p className='item-title-placeholder'>{item.name}</p>
      }
      <span className='line' />
      { item.originUrl !== '' &&
        <small>{item.originUrl.replace(/^https:\/\//, '')}</small>
      }
      <span className='date'>Sept 9, 2023</span>
    </motion.div>
  )
}

export default BookmarkItem