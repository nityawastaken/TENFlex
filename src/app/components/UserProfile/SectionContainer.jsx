import React from 'react'
import { SectionTitle } from './SectionTitle'

export const SectionContainer = ({ children, title, editFunction }) => {
    return (
        <section id={`${title}_section`} className='flex flex-col gap-2 border border-gray-300 rounded-md px-6 py-4 w-full lg:scroll-mt-36'>
            <SectionTitle title={title} />
            {children}
        </section>
    )
}
