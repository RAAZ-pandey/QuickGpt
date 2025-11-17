import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'


const Message = ({ Message }) => {


  useEffect(()=>{
    Prism.highlightAll()
  },[Message.content])

  return (
    <div>
      {Message.role === "user" ? (
        <div className='flex items-start justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl'>
            <p className='text-sm dark:text-primary'>{Message.content}</p>
            <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(Message.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} className='w-8 rounded-full' />
        </div>
      ) : (
        <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md my-4'>
          {Message.isImage ? (
            <img src={Message.content} alt="" className='w-full max-w-md mt-2 rounded-md' />
          ) : (
            <div className='text-sm dark:text-primary reset-tw'><Markdown> {Message.content}</Markdown></div>
          )}
        </div>
      )}
      <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(Message.timestamp).fromNow()}</span>
    </div>

  )
}

export default Message