import React from 'react'
import { useCloseChannelMutation } from '../../redux/features/api/apiSlice'

const CloseChannel = ({ channelPoint }: { channelPoint: string }) => {
  const [closeChannel] = useCloseChannelMutation();
  const handleSubmit = () => {
    // add input validation
    try {
      closeChannel({ channelPoint })
    } catch (error: any) {
      error.data.error ? console.error(error.data.error) : console.error(error);
    }
  }

  return (
    <button onClick={handleSubmit} className='bg-red-500 rounded-lg text-white p-[5px]'>Close channel</button>
  )
}

export default CloseChannel