import React, { Suspense } from 'react'
import GigLists from './GigLists'

const page = () => {
  return (
    <Suspense  fallback={<div>Loading...</div>}>
      <GigLists />
    </Suspense>
  )
}

export default page