import { useState, useRef, useEffect, createRef } from 'react';
import Image from 'next/image';
import Head from 'next/head'
import Avatar from "boring-avatars";
import dayjs from "dayjs";
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Toaster, toast } from 'sonner'
import { Drawer } from 'vaul';
// import BookmarkItem from '@/components/bookmarkItem';
import { isMobile } from 'react-device-detect';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { IconGlobe, IconLoading, IconPlus, IconText, IconWorld } from './Icons';
import { fetchWithTimeout, formatedDate } from '@/lib/fetcher';

function Bookmark() {
  const [newMark, setNewMark] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [bookmarkID, setBookmarkID] = useState('')
  const [bookmarkType, setBookmarkType] = useState('')
  const [bookmarkTypeValue, setBookmarkTypeValue] = useState('')
  const [bookmarks, setBookmarks] = useState([])
  const [filteredBookmarks, setFilteredBookmarks] = useState([])
  const [snap, setSnap] = useState("148px")
  const inputRef = useRef();
  const date = dayjs();
  const linkRefs = useRef([]);

  const fetchMetadata = async () => {
    // console.log(bookmarkID, bookmarkType, newMark)
    if (!newMark) return;
    if (bookmarkType !== 'web') return;
    const newValue = newMark
    handleAdded()

    try {
      const response = await fetchWithTimeout(`/api/get_meta_data?url=${encodeURIComponent(newValue)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }

      const data = await response.json();

      if (data) {
        setMetadata(data);
        const updatedBookmarks = bookmarks.map((item) => {
          if (item.id === bookmarkID) {
            item.attributes = data

            return item
          } else {
            return item
          }
        })

        if (updatedBookmarks.length) {
          setBookmarks(updatedBookmarks);
        }
      }
    } catch (error) {
      console.error(error);
      toast(`Can't take the domain, treat as text`)
      const updatedBookmarks = bookmarks.map((item) => {
        if (item.id === bookmarkID) {
          item.attributes.title = item.name
          item.bookmark_type = 'text'
          return item
        } else {
          return item
        }
      })

      if (updatedBookmarks.length) {
        setBookmarks(updatedBookmarks);
      }
    } finally {
      // handleAdded()
    }
  };

  const mainInputFocus = () => {
    setTimeout(function(){
      inputRef.current.focus();
      setLoading(false)
    }, 20)
  }

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddBookmark()
      return
    }
  };

  const handleArrowNavigation = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();

      // Find the currently focused link
      const focusedIndex = linkRefs.current.findIndex(
        (ref) => ref.current === document.activeElement
      );

      // Calculate the new index based on the arrow key pressed
      let newIndex =
        focusedIndex +
        (e.key === 'ArrowUp' ? -1 : 1) +
        linkRefs.current.length;

      newIndex %= linkRefs.current.length;

      // Focus on the new link
      linkRefs.current[newIndex].current?.focus();
    }
  };

  const handleMainInputBlur = () => {
    if (isMobile) {
      handleAddBookmark()
    }
  }

  const handleAddBookmark = () => {
    if (newMark.length) {
      setLoading(true)
      let new_bookmark_id = uuidv4()
      let temporary_title = bookmarkType !== 'web' ? newMark : ''

      let bookmark_item = {
        id: new_bookmark_id,
        name: newMark,
        attributes: {
          title: temporary_title,
          faviconUrl: '',
          originUrl: '',
        },
        bookmark_type: bookmarkType,
        created_at: new Date()
      }
      setBookmarkID(new_bookmark_id)
      setBookmarks(oldArray => [bookmark_item, ...oldArray]);

      if (bookmarkType !== 'web') {
        handleAdded()
      }
    }
  }

  const handleAdded = () => {
    setBookmarkType('')
    mainInputFocus()
    setLoading(false)
    setNewMark('')
  }

  const isValidUrl = (urlString) => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
      '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
    return !!urlPattern.test(urlString);
  }

  const isValidColor = (colorString) => {
    const s = new Option().style;
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$|^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0(\.\d+)?|1(\.0+)?)\s*\)$/;
    s.color = colorString;
  
    return (s.color == colorString) ? (s.color == colorString) : colorRegex.test(colorString);
  }

  const defineBookmark = (e) => {
    const rawBookmark = e.target.value
    const filteredResults = bookmarks.filter(item =>
      item.name.toLowerCase().includes(rawBookmark.toLowerCase())
    );

    setNewMark(rawBookmark)
    setFilteredBookmarks(filteredResults)
    
    if (rawBookmark !== '' && isValidUrl(rawBookmark)) {
      setBookmarkType('web')
      return
    }

    if (rawBookmark !== '' && isValidColor(rawBookmark)) {
      setBookmarkType('color')
      setBookmarkTypeValue(rawBookmark)
      return
    }

    if (!isValidUrl(rawBookmark) || !isValidColor(rawBookmark)) {
      setBookmarkType('text')
      return
    }

    if(rawBookmark === '') {
      setBookmarkType('')
      return
    }
  }
  
  useEffect(() => {
    // setTimeout(function(){
    fetchMetadata()
    setBookmarkType('')
    mainInputFocus()
    // }, 400)
  }, [ bookmarkID ]);


  useEffect(() => {
    // Set up refs for each link element
    linkRefs.current = bookmarks.map(() => createRef());

    // Attach the event listener for Arrow Up and Arrow Down key navigation
    document.addEventListener('keydown', handleArrowNavigation);

    // Focus on the first link initially
    if (linkRefs.current[0] && linkRefs.current[0].length > 0) {
      linkRefs.current[0].current.focus();
    }

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleArrowNavigation);
    };
  }, [bookmarks]);

  useEffect(() => {
    setFilteredBookmarks(bookmarks)
  }, [bookmarks])

  return (
    <div className="">
      <Head>
        <title>Bookmark</title>
      </Head>
      <Toaster position="bottom-center" />
      <div className='bookmark-header'>
        <div>
          <h3>Bookmarks</h3>
          <p>{dayjs().format('DD MMM YYYY')}</p>
        </div>
        <Avatar
          size={38}
          name="Maria Mitchell"
          variant="marble"
          colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
        />
      </div>
      <div className={`bookmark-bar ${open && 'hidden-bar'}`}>
        <Drawer.Root
          onOpenChange={setOpen}
          snapPoints={["400px", 1]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
        >
          <Drawer.Trigger asChild>
            <motion.div initial={{translateX: 0}} exit={{translateX: -50}} className='switch-collection'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 15L12 20L17 15M7 9L12 4L17 9" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </Drawer.Trigger>

          <Drawer.Portal>
            <Drawer.Content className='dialog'>
              <p>Switch Collection</p>
            </Drawer.Content>
            <Drawer.Overlay className='dialog-overlay' />
          </Drawer.Portal>
        </Drawer.Root>
        <div className='bookmark-input-area'>
          <div className='bookmark-icon'>
            { loading &&
              <div className='loader'>
                <IconLoading />
              </div>
            }
            { !loading && (bookmarkType === '' || bookmarkType === 'text') && (
              <IconPlus />
            )}

            { !loading && bookmarkType === 'color' && (
              <div className='icon-color' style={{ backgroundColor: newMark }} />
            )}

            { !loading && bookmarkType === 'web' && (
              <IconGlobe />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Insert a link or any text"
            value={newMark}
            onChange={(e) => defineBookmark(e)}
            className='main-input'
            onKeyDown={handleEnterKeyPress}
            // onBlur={handleMainInputBlur}
            disabled={loading}
          />
        </div>
        <Drawer.Root
          onOpenChange={setOpen}
          snapPoints={["400px", 1]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
        >
          <Drawer.Trigger asChild>
            <motion.div initial={{translateX: 0}} exit={{translateX: 50}} className='show-setting'>
              <Avatar
                size={32}
                name="Maria Mitchell"
                variant="marble"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </motion.div>
          </Drawer.Trigger>

          <Drawer.Portal>
            <Drawer.Content className='dialog'>
              <p>Settings</p>
            </Drawer.Content>
            <Drawer.Overlay className='dialog-overlay' />
          </Drawer.Portal>
        </Drawer.Root>

        <div className='blur' />
      </div>

      {bookmarks.length >= 1 && (
        <div className='list-header'>
          <p>Title</p>
          <p>Date</p>
        </div>
      )}

      <div className='lists'>
        {filteredBookmarks.length !== 0 && filteredBookmarks.map((item, index) => (
          <a
            key={item.id}
            href={item.attributes ? item.attributes.originUrl : '#'}
            target={item.attributes.originUrl && '_blank'}
            tabIndex={0}
            className='item-list'
            ref={linkRefs.current[index]}
            title={item.attributes.title}
            rel="noreferrer"
          >
            <ContextMenu.Root>
            <ContextMenu.Trigger className="ContextMenuTrigger">
              {/* <img src={item.faviconUrl.includes('http') ? item.faviconUrl : (item.url + item.faviconUrl)} alt="Website Thumbnail" height="16px" /> */}
              <div className='item-favicon'>
                { item.bookmark_type === 'web' && item.attributes.originUrl !== '' &&
                  <Image src={`https://www.google.com/s2/favicons?domain=${item.attributes.originUrl}&sz=${128}`} alt="Website Thumbnail" height="20" width="20" />
                }
                { item.bookmark_type === 'web' && item.attributes.originUrl === '' &&
                  <div className='loader'>
                    <IconLoading />
                  </div>
                }
                { item.bookmark_type === 'color' && (
                  <div className='icon-color' style={{ backgroundColor: item.name }} />
                )}

                { item.bookmark_type === 'text' && (
                  <IconText />
                )}
              </div>
              { item.attributes.title !== '' ?
                <p className='item-title'>{item.attributes.title}</p>
                :
                <p className='item-title-placeholder'>{item.name}</p>
              }
              <span className='line' />
              { item.attributes.originUrl !== '' &&
                <small>{item.attributes.originUrl.replace(/^https:\/\//, '')}</small>
              }
              <span className='date'>{formatedDate(item.created_at)}</span>
              </ContextMenu.Trigger>
              <ContextMenu.Portal>
                <ContextMenu.Content className="ContextMenuContent" sideOffset={5} align="end">
                  <ContextMenu.Item className="ContextMenuItem">
                    Copy
                  </ContextMenu.Item>
                  <ContextMenu.Item className="ContextMenuItem">
                    Rename
                  </ContextMenu.Item>
                  <ContextMenu.Item className="ContextMenuItem">
                    Delete
                  </ContextMenu.Item>
                </ContextMenu.Content>
              </ContextMenu.Portal>
            </ContextMenu.Root>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Bookmark;