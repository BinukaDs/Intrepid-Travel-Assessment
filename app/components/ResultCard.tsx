import React from 'react'
import FadeInUp from './animations/FadeInUp';
import { ResultItem } from '../types';
const ResultCard: React.FC<{ item: ResultItem; key: number }> = ({ item, key }) => {
  return (
    <FadeInUp key={item.id} delay={0.15 * key}>
      <li key={item.id} className="p-4 border rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <div className="font-bold text-lg">{item.title}</div>
        <div className="text-sm text-gray-500 ">
          <span className="mr-2">Location: {item.location}</span>
          <span className="mr-2">Price: ${item.price}</span>
          <span>Tags: {item.tags.join(", ")}</span>
        </div>
        <div className="mt-2 italic text-sm text-red-500">
          Why matched: {item.reason}
        </div>
      </li>
    </FadeInUp >
  )
}

export default ResultCard